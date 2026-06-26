import TopNavbar from '../components/layout/TopNavbar';
import BottomNav from '../components/layout/BottomNav';

const FAQ_ITEMS = [
  {
    q: 'Кейс яаж нээх вэ?',
    a: 'Дансаа цэнэглээд кейс сонгож нээнэ. Хожсон skin тань агуулахад автоматаар нэмэгдэнэ.',
  },
  {
    q: 'Төлбөрийн систем яаж ажилладаг вэ?',
    a: 'Дөк, Ами, Чочироо 3ийн дэлгүүр wallet систем ашигладаг. Карт эсвэл криптогоор цэнэглээд кейс нээх, дэлгүүрээс skin авахад ашиглана.',
  },
  {
    q: 'Steam рүү skin татаж болох уу?',
    a: 'Болно. Агуулахаас skin-ээ сонгоод Steam рүү татах хүсэлт илгээнэ.',
  },
  {
    q: 'Уналтын хувь хэд вэ?',
    a: 'Кейс бүр өөрийн уналтын хувийг харуулна. Цэргийн, хязгаарлагдмал, нууц, далд болон онцгой ховор зүйлс өөр өөр магадлалтай.',
  },
  {
    q: 'Skin буцааж зарж болох уу?',
    a: 'Болно. Агуулахаас нэг нэгээр нь эсвэл бүгдийг нь зарж, дүнг wallet-д авна.',
  },
  {
    q: 'Энэ CS2 skin дэлгүүр мөн үү?',
    a: 'Тийм. Энэ бол CS2 skin авах, кейс нээх, агуулахаа удирдах зориулалттай дэлгүүрийн platform.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">FAQ</h1>
        <p className="text-loot-muted text-sm mb-8">Дөк, Ами, Чочироо 3ийн дэлгүүрийн түгээмэл асуултууд</p>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="loot-card p-4 group">
              <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between">
                {item.q}
                <svg className="w-4 h-4 text-loot-muted group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-loot-muted text-sm mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
