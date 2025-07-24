import Image from "next/image";

const items = [
  {
    title: "สินเชื่อซื้อขายรถบรรทุกมือสอง",
    img: "/images/product/product01.jpg",
  },
  {
    title: "สินเชื่อเพิ่มสภาพคล่อง",
    img: "/images/product/product02.jpg",
  },
  {
    title: "รถพร้อมประมูล",
    img: "/images/product/product03.jpg",
  },
  {
    title: "สินเชื่อรถมอเตอร์ไซด์",
    img: "/images/product/product04.jpg",
  },
  {
    title: "สินเชื่อจำนำทะเบียน",
    img: "/images/product/product05.jpg",
  },
  {
    title: "บริการนายหน้าประกันภัย",
    img: "/images/product/product06.jpg",
  },
];

export default function ProductsServices() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold mb-8">ผลิตภัณฑ์และบริการ</h2>
      <div className="container">
        <div className="row g-4 justify-content-center">
          {items.map((item, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="card text-center h-100 shadow-sm">
                <div
                  className="card-body d-flex flex-column align-items-center justify-content-end position-relative"
                  style={{ minHeight: 220, overflow: "hidden" }}
                >
                  {/* พื้นหลังแต่ละใบเป็นรูป item.img */}
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover rounded-3"
                    style={{
                      zIndex: 0,
                      opacity: 1.17,
                      pointerEvents: "none",
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Title อยู่ล่างสุดในกล่อง */}
                  <div
                    className="position-relative w-100"
                    style={{ zIndex: 1 }}
                  >
                    <h5 className="card-title fw-bold bg-white bg-opacity-80 rounded px-2 py-1 mb-2">
                      {item.title}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
