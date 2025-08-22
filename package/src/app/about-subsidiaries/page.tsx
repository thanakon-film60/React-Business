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
              <h3 className="text-[18px] font-extrabold text-neutral-900">
                บริษัทในเครือ
              </h3>
              <div className="mt-2 text-[13px] leading-6 text-neutral-700">
                <p>
                  บริษัท ทีพีพี วินเตอร์เชิ่ลแมน จำกัด
                  <br />
                  ก่อตั้งเมื่อวันที่ 19 มกราคม พ.ศ. 2536
                  <br />
                  ทุนจดทะเบียน : 100 ล้านบาท (3 ส่วนเท่าๆ กัน)
                  <br />
                  ทุนชำระแล้ว : 30 ล้านบาท (910,000 หุ้นชำระแล้ว)
                  <br />
                  ประธาน : พิพัฒน์ อังวัฒนศิริ
                  <br />
                  กรรมการผู้จัดการ : เกล้าอิรวดี วงษ์วิเศษ ส่วลสงฆ์ศรี
                  <br />
                  กิจการ : ผู้ให้บริการขนส่งระหว่างประเทศ
                  (ตัวแทนพิเศษของโอมานแอร์คาร์โก้ในประเทศไทย)
                </p>
              </div>
            </article>

            {/* Card: Contact us */}
            <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/10">
              <h3 className="text-[18px] font-extrabold text-neutral-900">
                กรุณาติดต่อเราได้ที่
              </h3>
              <div className="mt-2 grid gap-4 md:grid-cols-2">
                <div className="text-[13px] leading-6 text-neutral-700">
                  <p>
                    www.omanair.com : Oman Air-Thai
                    <br />
                    สอบถามข้อมูลเพิ่มเติมโทรศัพท์ (662) 175-2201-8 ต่อ คาโก้
                    <br />
                    <br />
                    สำนักงานใหญ่
                    <br />
                    9/9 หมู่ 6 ถนนกิ่งแก้ว อ.บางพลี จ.สมุทรปราการ 10540
                    <br />
                    <br />
                    สำนักงานขาย
                    <br />
                    36/152 RK Biz Center ซ.บางนา–ตราด กม.4
                    <br />
                    เขตบางนา กรุงเทพมหานคร 10520 ประเทศไทย
                    <br />
                    โทร : (662) 171-782
                  </p>
                </div>
                {/* รูปเครื่องบิน 1/2 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
                  <img
                    src="/images/plane.jpg"
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
            <img
              src="/images/subsidiaries/Oman_Cargo_map.png"
              alt="Hero image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
