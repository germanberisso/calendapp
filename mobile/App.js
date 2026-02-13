import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

const db = SQLite.openDatabaseSync('calendapp.db');

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL
      );
    `);
    loadShifts();
  }, []);

  const loadShifts = () => {
    const result = db.getAllSync('SELECT * FROM shifts');
    setShifts(result);
  };

  const createShift = (date, type) => {
    db.runSync('INSERT OR REPLACE INTO shifts (date, type) VALUES (?, ?)', [date, type]);
    loadShifts();
  };

  const getShiftByDate = (date) => {
    return shifts.find(s => s.date === date);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getShiftColor = (type) => {
    switch (type) {
      case 'M': return '#ec4899';
      case 'N': return '#06b6d4';
      case 'F': return '#86efac';
      case 'Fe': return '#fb923c';
      default: return '#fff';
    }
  };

  const handleDayPress = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const shift = getShiftByDate(dateStr);

    const types = ['M', 'N', 'F', 'Fe', null];
    const currentType = shift?.type;
    const currentIndex = types.indexOf(currentType || null);
    const nextType = types[(currentIndex + 1) % types.length];

    if (nextType) {
      createShift(dateStr, nextType);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          <Text style={styles.navButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </Text>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          <Text style={styles.navButton}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.calendar}>
        <View style={styles.grid}>
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const shift = getShiftByDate(dateStr);
            const bgColor = shift ? getShiftColor(shift.type) : '#fff';

            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.dayCell, { backgroundColor: bgColor }]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={styles.dayNumber}>{format(day, 'd')}</Text>
                {shift && <Text style={styles.shiftType}>{shift.type}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ec4899' }]} />
          <Text>Mañana</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#06b6d4' }]} />
          <Text>Noche</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#86efac' }]} />
          <Text>Franco</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#fb923c' }]} />
          <Text>Feriado</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#2563eb' },
  navButton: { color: '#fff', fontSize: 24, fontWeight: 'bold', padding: 8 },
  monthTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
  calendar: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  dayCell: { width: '14.28%', aspectRatio: 1, padding: 8, margin: 1, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  dayNumber: { fontSize: 16, fontWeight: '600' },
  shiftType: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 16, height: 16, borderRadius: 4 },
});
