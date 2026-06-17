import { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'
import { WEEKDAY_DISPLAY } from '../lib/dateUtils'
import { CloseIcon } from './icons'

export function TaskModal({ task, onSave, onClose, onDelete }) {
  const isEditing = !!task
  const [name, setName] = useState(task?.name || '')
  const [description, setDescription] = useState(task?.description || '')
  const [allDays, setAllDays] = useState(task ? task.days === 'all' : true)
  const [selectedDays, setSelectedDays] = useState(task && task.days !== 'all' ? task.days : [])

  const toggleDay = (day) => {
    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]))
  }

  const canSave = name.trim() && (allDays || selectedDays.length > 0)

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      days: allDays ? 'all' : selectedDays,
    })
  }

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
        >
          {/* Inner Pressable swallows taps so they don't close the sheet. */}
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{isEditing ? 'Edit Task' : 'New Task'}</Text>
              <Pressable onPress={onClose} hitSlop={8} style={{ padding: 4 }}>
                <CloseIcon />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
              <View style={styles.body}>
                <View>
                  <Text style={styles.label}>Task Name *</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Morning workout"
                    placeholderTextColor="#9ca3af"
                    autoFocus
                    style={styles.input}
                  />
                </View>

                <View>
                  <Text style={styles.label}>
                    Description <Text style={styles.labelHint}>(optional)</Text>
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Any notes..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={2}
                    style={[styles.input, { height: 64, textAlignVertical: 'top' }]}
                  />
                </View>

                <View>
                  <Text style={styles.label}>Schedule</Text>
                  <Pressable style={styles.radioRow} onPress={() => setAllDays(true)}>
                    <View style={[styles.radio, allDays && styles.radioOn]}>
                      {allDays && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioLabel}>Every day</Text>
                  </Pressable>
                  <Pressable style={styles.radioRow} onPress={() => setAllDays(false)}>
                    <View style={[styles.radio, !allDays && styles.radioOn]}>
                      {!allDays && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioLabel}>Specific days</Text>
                  </Pressable>

                  {!allDays && (
                    <View style={styles.dayWrap}>
                      {WEEKDAY_DISPLAY.map(({ key, label }) => {
                        const active = selectedDays.includes(key)
                        return (
                          <Pressable
                            key={key}
                            onPress={() => toggleDay(key)}
                            style={[styles.dayChip, active && styles.dayChipOn]}
                          >
                            <Text style={[styles.dayChipText, active && styles.dayChipTextOn]}>{label}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              {isEditing && (
                <Pressable onPress={() => onDelete(task.id)} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              )}
              <View style={styles.footerRight}>
                <Pressable onPress={onClose} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={!canSave}
                  style={[styles.saveBtn, { backgroundColor: canSave ? '#6366f1' : '#c7d2fe' }]}
                >
                  <Text style={styles.saveText}>{isEditing ? 'Save Changes' : 'Add Task'}</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  kav: { width: '100%' },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  body: { padding: 20, gap: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  labelHint: { fontWeight: '400', color: '#9ca3af' },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: '#6366f1' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366f1' },
  radioLabel: { fontSize: 14, color: '#374151' },
  dayWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingLeft: 24, marginTop: 4 },
  dayChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#f3f4f6' },
  dayChipOn: { backgroundColor: '#6366f1' },
  dayChipText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  dayChipTextOn: { color: '#fff' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  footerRight: { flexDirection: 'row', gap: 8, marginLeft: 'auto', alignItems: 'center' },
  deleteText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  cancelText: { color: '#6b7280', fontWeight: '600', fontSize: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})
