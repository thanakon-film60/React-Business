export default function OmanAirStyleLayout() {
  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-neutral-100 p-0">
      {/* Artboard */}
      <section className="h-full w-full bg-white p-6 md:p-8">
        {/* ------- Split layout: left narrow column, right hero ------- */}
        <div className="grid h-full items-stretch gap-6 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="order-1 space-y-5 lg:order-1">
            {/* Card: Company group */}
            <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10">
              <h3 className="my-heading font-extrabold text-neutral-900">
                บริษัทในเครือ
              </h3>
              <div className="mt-2 text-[16px] leading-6 text-neutral-700">
                <p>
                  บริษัท ทีพีพี อินเตอร์เนชั่นแนล จำกัด
                  <br />
                  ก่อตั้งเมื่อวันที่ 19 มกราคม พ.ศ. 2536
                  <br />
                  ทุนจดทะเบียน : 100 ล้านบาท (3 ล้านเหรียญสหรัฐ)
                  <br />
                  ทุนชำระแล้ว : 30 ล้านบาท (910,000 เหรียญสหรัฐ)
                  <br />
                  ประธาน : นายศุภพงศ์ อัศวินวิจิตร
                  <br />
                  กรรมการผู้จัดการ : นางสาวรัชนีวรรณ ลิ่วเฉลิมวงศ์
                  <br />
                  สำนักงานขายและบริการทั่วไปของโอมานแอร์ในประเทศไทย
                  (ตัวแทนพิเศษของโอมานแอร์คาร์โก้ในประเทศไทย)
                </p>
              </div>
            </article>

            {/* Card: Contact us */}
            <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10">
              <h3 className="my-heading font-extrabold text-neutral-900">
                กรุณาเยี่ยมชมเราได้ที่
              </h3>
              <div className="mt-2 grid gap-4 md:grid-cols-2">
                <div className="text-[16px] leading-6 text-neutral-700">
                  <p>
                    www.omanair.com : Oman Air-Thai
                    <br />
                    สอบถามข้อมูลเพิ่มเติมได้ที่โทร (662) 175-2201-8
                    <br />
                    <br />
                    สำนักงาน
                    <br />
                    9/9 หมู่ 6 ถ.กิ่งแก้ว ต.ราชาเทวา อ.บางพลี
                    <br />
                    จ.สมุทรปราการ 10540
                    <br />
                    <br />
                    สำนักงานขนส่งสินค้า
                    <br />
                    36/152 RK BIZ Center ถนนด้านหน้าถนน
                    <br />
                    มอเตอร์เวย์-ร่มเกล้าแขวงคลองตันนุ่น เขตลาดกระบัง
                    <br />
                    กรุงเทพมหานคร ๅจถ/จ ประเทศไทย
                    <br />
                    โทร: (662) 171-782
                  </p>
                </div>
                {/* รูปเครื่องบิน 1/2 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <img
                    src="/images/subsidiaries/Oman_Cargo_plane.png"
                    alt="Airplane"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT HERO PANEL */}
          <div className="order-2 relative h-full overflow-hidden rounded-2xl bg-black/10 p-0 ring-1 ring-black/10 lg:order-2">
            {/* Top-right logos */}
            <div className="pointer-events-none absolute right-6 top-6 z-10 flex items-center gap-4">
              {/* <div className="h-10 w-28 rounded bg-white/95 ring-1 ring-black/10" />
              <div className="h-10 w-24 rounded bg-white/95 ring-1 ring-black/10" /> */}
            </div>

            {/* Map artwork placeholder */}
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/subsidiaries/Oman_Cargo_mapPx.png"
                alt="Hero image"
                className="block w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
