export type ScheduleType = 'main' | 'study' | 'saturday'

export interface WeeklySchedule {
  type: ScheduleType
  days: number[] // 0 = Sunday, 1 = Monday, etc.
  label: string
  activities: Activity[]
}

export interface Activity {
  id: string
  startTime: string // format: "HH:mm"
  endTime: string // format: "HH:mm"
  title: string
  duration: number // in minutes
  type: ActivityType
  description?: string
}

export const periodLabels = {
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер'
}

export type ActivityType = 'english' | 'coding' | 'linkedin' | 'break' | 'leisure' | 'food' | 'other' | 'transport'

export const scheduleTypes: WeeklySchedule[] = [
  {
    type: 'main',
    label: 'Основное',
    days: [1, 3, 5, 0], // Пн, Ср, Пт, Вс
    activities: [
      { id: '1', startTime: '08:00', endTime: '08:15', title: 'Завтрак', duration: 15, type: 'food' },
      { id: '2', startTime: '08:15', endTime: '09:00', title: 'Английский: грамматика/лексика', duration: 45, type: 'english' },
      { id: '3', startTime: '09:00', endTime: '09:10', title: 'LinkedIn: connect-заявки', duration: 10, type: 'linkedin' },
      { id: '4', startTime: '09:10', endTime: '09:30', title: 'Английский: слушание с субтитрами', duration: 20, type: 'english' },
      { id: '5', startTime: '09:30', endTime: '09:35', title: 'Короткий перерыв', duration: 5, type: 'break' },
      { id: '6', startTime: '09:35', endTime: '10:35', title: 'Кодирование: проект', duration: 60, type: 'coding' },
      { id: '7', startTime: '10:35', endTime: '10:40', title: 'Короткий перерыв', duration: 5, type: 'break' },
      { id: '8', startTime: '10:40', endTime: '11:40', title: 'Английский: Busuu или аудио-тренинг', duration: 60, type: 'english' },
      { id: '9', startTime: '11:40', endTime: '12:00', title: 'Кодирование: мелкая работа/рефакторинг', duration: 20, type: 'coding' },
      { id: '10', startTime: '12:00', endTime: '12:10', title: 'LinkedIn: отклики/сообщения', duration: 10, type: 'linkedin' },
      { id: '11', startTime: '12:10', endTime: '12:15', title: 'Короткий перерыв', duration: 5, type: 'break' },
      { id: '12', startTime: '12:15', endTime: '12:35', title: 'Кодирование: фокус-сессия', duration: 20, type: 'coding' },
      { id: '13', startTime: '12:35', endTime: '13:30', title: 'Английский: подкаст + словарь', duration: 55, type: 'english' },
      { id: '14', startTime: '13:30', endTime: '13:45', title: 'Обед', duration: 15, type: 'food' },
      { id: '15', startTime: '13:45', endTime: '14:10', title: 'Кодирование', duration: 25, type: 'coding' },
      { id: '16', startTime: '14:10', endTime: '14:20', title: 'LinkedIn: входящие', duration: 10, type: 'linkedin' },
      { id: '17', startTime: '14:20', endTime: '14:30', title: 'Перерыв: шахматы или растяжка', duration: 10, type: 'break' },
      { id: '18', startTime: '14:30', endTime: '15:00', title: 'Кодирование или мини-проект', duration: 30, type: 'coding' },
      { id: '19', startTime: '15:00', endTime: '16:00', title: 'Busuu или сериал на английском', duration: 60, type: 'english' },
      { id: '20', startTime: '16:00', endTime: '17:00', title: 'Кодирование: глубокая работа', duration: 60, type: 'coding' },
      { id: '21', startTime: '17:00', endTime: '17:15', title: 'Короткий перерыв', duration: 15, type: 'break' },
      { id: '22', startTime: '17:15', endTime: '18:00', title: 'Теория React или JS', duration: 45, type: 'coding' },
      { id: '23', startTime: '18:00', endTime: '18:30', title: 'author.today', duration: 30, type: 'leisure' },
      { id: '24', startTime: '18:30', endTime: '19:15', title: 'Просмотр дорамы', duration: 45, type: 'leisure' },
      { id: '25', startTime: '19:15', endTime: '20:00', title: 'Ужин и свободное плавание', duration: 45, type: 'food' },
      { id: '26', startTime: '20:00', endTime: '21:00', title: 'Повторение слов/определений', duration: 60, type: 'english' },
      { id: '27', startTime: '21:00', endTime: '21:30', title: 'Дневник побед', duration: 30, type: 'other' },
      { id: '28', startTime: '21:30', endTime: '21:45', title: 'Author.today', duration: 15, type: 'leisure' },
      { id: '29', startTime: '21:45', endTime: '23:00', title: 'дорама', duration: 75, type: 'leisure' },
      { id: '30', startTime: '23:00', endTime: '23:30', title: 'Шахматы', duration: 30, type: 'leisure' },
      { id: '31', startTime: '23:30', endTime: '23:55', title: 'Подготовка ко сну', duration: 25, type: 'other' }
    ]
  },
  {
    type: 'study',
    label: 'Учебные дни',
    days: [2, 4], // Вт, Чт
    activities: [
      { id: '1', startTime: '08:00', endTime: '08:20', title: 'YouTube (мягкий старт)', duration: 20, type: 'leisure' },
      { id: '2', startTime: '08:20', endTime: '09:00', title: 'Лисенинг: сериал / аудио / сайт (Busuu и др.)', duration: 40, type: 'english' },
      { id: '3', startTime: '09:00', endTime: '09:10', title: 'LinkedIn: connect-заявки', duration: 10, type: 'linkedin' },
      { id: '4', startTime: '09:10', endTime: '09:30', title: 'Осознанный отдых, без дел', duration: 20, type: 'break' },
      { id: '5', startTime: '09:30', endTime: '11:30', title: 'Busuu: упражнения + чай / прогулка', duration: 120, type: 'english' },
      { id: '6', startTime: '11:30', endTime: '12:10', title: 'LinkedIn: входящие, без напряга', duration: 40, type: 'linkedin' },
      { id: '7', startTime: '12:10', endTime: '13:10', title: 'Лисенинг: видеоразбор / подкаст', duration: 60, type: 'english' },
      { id: '8', startTime: '13:10', endTime: '14:45', title: 'Расслабление / дорама', duration: 95, type: 'leisure' },
      { id: '9', startTime: '14:45', endTime: '15:15', title: 'Пока не придумал', duration: 30, type: 'other' },
      { id: '10', startTime: '15:15', endTime: '15:30', title: 'Подготовка к купанию', duration: 15, type: 'other' },
      { id: '11', startTime: '15:30', endTime: '16:00', title: 'Купание', duration: 30, type: 'other' },
      { id: '12', startTime: '16:00', endTime: '16:35', title: 'Одевание и сборы', duration: 35, type: 'other' },
      { id: '13', startTime: '16:35', endTime: '16:45', title: 'Дорога до остановки', duration: 10, type: 'transport' },
      { id: '14', startTime: '16:45', endTime: '17:00', title: 'Подождать пока маршрутка придёт', duration: 15, type: 'transport' },
      { id: '15', startTime: '17:00', endTime: '17:15', title: 'Подождать пока маршрутка меня довезёт до остановки', duration: 15, type: 'transport' },
      { id: '16', startTime: '17:15', endTime: '17:30', title: 'Прогуляться до места назначения уроков', duration: 15, type: 'transport' },
      { id: '17', startTime: '17:30', endTime: '19:30', title: 'Английский: урок с преподавателем', duration: 120, type: 'english' },
      { id: '18', startTime: '19:30', endTime: '19:45', title: 'Добраться до остановки', duration: 15, type: 'transport' },
      { id: '19', startTime: '19:45', endTime: '20:00', title: 'Подождать пока маршрутка придёт', duration: 15, type: 'transport' },
      { id: '20', startTime: '20:00', endTime: '20:15', title: 'Подождать пока маршрутка меня довезёт до домой', duration: 15, type: 'transport' },
      { id: '21', startTime: '20:15', endTime: '20:45', title: 'Ужин, отдых', duration: 30, type: 'food' },
      { id: '22', startTime: '20:45', endTime: '21:30', title: 'Author.today / сериал на английском', duration: 45, type: 'leisure' },
      { id: '23', startTime: '21:30', endTime: '22:30', title: 'Лисенинг или дорама', duration: 60, type: 'english' },
      { id: '24', startTime: '22:30', endTime: '23:00', title: 'Шахматы / дневник побед', duration: 30, type: 'leisure' },
      { id: '25', startTime: '23:00', endTime: '23:30', title: 'Подготовка ко сну', duration: 30, type: 'other' }
    ]
  },
  {
    type: 'saturday',
    label: 'Суббота',
    days: [6], // Сб
    activities: [
      { id: '1', startTime: '08:00', endTime: '08:20', title: 'YouTube, мягкий старт', duration: 20, type: 'leisure' },
      { id: '2', startTime: '08:20', endTime: '09:00', title: 'Английский: повторение/лексика', duration: 40, type: 'english' },
      { id: '3', startTime: '09:00', endTime: '09:10', title: 'LinkedIn: минимум connect', duration: 10, type: 'linkedin' },
      { id: '4', startTime: '09:10', endTime: '11:00', title: 'Busuu / автор.today / прогулка', duration: 110, type: 'english' },
      { id: '5', startTime: '11:00', endTime: '12:30', title: 'React: 1 тема + отдых', duration: 90, type: 'coding' },
      { id: '6', startTime: '12:30', endTime: '13:40', title: 'Busuu: аудио + пассивное слушание', duration: 70, type: 'english' },
      { id: '7', startTime: '13:40', endTime: '14:45', title: 'Обед и подготовка', duration: 65, type: 'food' },
      { id: '8', startTime: '14:45', endTime: '18:45', title: 'Репетитор + дорога', duration: 240, type: 'english' },
      { id: '9', startTime: '18:45', endTime: '19:30', title: 'Ужин, рекавери', duration: 45, type: 'food' },
      { id: '10', startTime: '19:30', endTime: '20:30', title: 'Author.today / сериал на английском', duration: 60, type: 'leisure' },
      { id: '11', startTime: '20:30', endTime: '21:30', title: 'Ничего не делать с достоинством', duration: 60, type: 'break' },
      { id: '12', startTime: '21:30', endTime: '22:30', title: 'Дорама / мини-повтор React (если силы есть)', duration: 60, type: 'leisure' },
      { id: '13', startTime: '22:30', endTime: '23:00', title: 'Шахматы', duration: 30, type: 'leisure' },
      { id: '14', startTime: '23:00', endTime: '23:15', title: 'Дневник побед', duration: 15, type: 'other' },
      { id: '15', startTime: '23:15', endTime: '23:55', title: 'Подготовка ко сну', duration: 40, type: 'other' }
    ]
  }
]

export const activityColors = {
  english: 'from-blue-500/20 to-blue-400/20',
  coding: 'from-green-500/20 to-green-400/20',
  linkedin: 'from-orange-500/20 to-orange-400/20',
  break: 'from-gray-500/20 to-gray-400/20',
  leisure: 'from-purple-500/20 to-purple-400/20',
  food: 'from-yellow-500/20 to-yellow-400/20',
  transport: 'from-red-500/20 to-red-400/20',
  other: 'from-primary-500/20 to-primary-400/20'
}

export const activityIcons = {
  english: '🔤',
  coding: '💻',
  linkedin: '🔗',
  break: '☕',
  leisure: '🎮',
  food: '🍽️',
  transport: '🚌',
  other: '📝'
}

export const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
