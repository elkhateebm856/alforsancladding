export interface VideoItem {
  id: number
  title: string
  description: string
  src: string
  thumbnail: string
  date: string
}

export const videos: VideoItem[] = [
  {
    id: 1,
    title: 'واجهة كلادينج بعد التشطيب',
    description: 'استعراض الواجهة بعد الانتهاء من تنفيذ وتشطيب الكلادينج.',
    src: '/video3.mp4',
    thumbnail: '/cladding-finished1.jpg',
    date: '2026-08-01',
  },
  {
    id: 2,
    title: 'تشطيب نهائي لواجهة كلادينج',
    description: 'فيديو يوضح الشكل النهائي لواجهة الكلادينج بعد اكتمال المشروع.',
    src: '/video4.mp4',
    thumbnail: '/cladding-finished2.jpg',
    date: '2026-08-01',
  },
]
