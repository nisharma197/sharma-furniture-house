export default function WhatsappButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP || "91XXXXXXXXXX";
  const message = encodeURIComponent("Hi, I'd like to enquire about custom furniture / carpentry work.");

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform focus-ring"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.79 14.05c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .9 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.2.68-.79.87-1.06.18-.28.36-.23.6-.14.24.1 1.55.73 1.82.86.27.14.44.2.51.32.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  );
}
