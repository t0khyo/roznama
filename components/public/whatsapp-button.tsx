export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/96598040875"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-50 group flex items-center gap-3"
    >
      {/* Tooltip */}
      <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-[#1A1714] text-[#FAF8F3] font-cairo text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none">
        تواصل عبر واتساب
      </span>

      {/* Button */}
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform duration-300"
        style={{ boxShadow: "0 4px 24px rgba(37,211,102,0.4)" }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        {/* WhatsApp icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 2.333C7.557 2.333 2.333 7.557 2.333 14c0 2.04.539 3.954 1.48 5.607L2.333 25.667l6.207-1.458A11.585 11.585 0 0014 25.667c6.443 0 11.667-5.224 11.667-11.667S20.443 2.333 14 2.333z"
            fill="white"
          />
          <path
            d="M14 4.083C8.523 4.083 4.083 8.523 4.083 14c0 1.87.51 3.62 1.398 5.118l.215.362-1.115 4.059 4.178-1.095.347.205A9.872 9.872 0 0014 23.917c5.477 0 9.917-4.44 9.917-9.917S19.477 4.083 14 4.083zm5.11 13.764c-.225.634-1.316 1.21-1.808 1.252-.46.039-.893.195-3.004-.626-2.55-1-4.164-3.608-4.29-3.776-.126-.168-1.03-1.371-1.03-2.617 0-1.245.652-1.858.883-2.112.23-.253.503-.316.67-.316l.483.009c.155.006.363-.059.568.433.212.509.72 1.756.783 1.883.063.126.105.273.02.441-.084.168-.126.273-.252.42-.126.148-.266.33-.379.443-.126.126-.257.263-.11.516.147.253.653 1.077 1.402 1.744.963.858 1.775 1.123 2.028 1.249.252.126.4.105.547-.063.147-.168.632-.737.8-.99.168-.252.336-.21.568-.126.231.084 1.47.694 1.722.82.253.126.42.189.483.294.063.105.063.61-.162 1.243z"
            fill="#25D366"
          />
        </svg>
      </div>
    </a>
  )
}
