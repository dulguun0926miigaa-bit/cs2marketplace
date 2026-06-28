import { steamService } from '../../services/steam.service';

// Official Steam logo SVG path
const SteamLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 196 196" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="98" cy="98" r="98" fill="#1b2838"/>
    <path d="M98 30C60.3 30 30 60.3 30 98c0 30.7 19.8 56.9 47.5 66.3l17.1-70.7c-.4-1.1-.6-2.3-.6-3.6 0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-.1 0-.3 0-.4 0l-16.8 69.5c.7.1 1.5.1 2.2.1 37.7 0 68-30.3 68-68S135.7 30 98 30z" fill="white"/>
    <circle cx="98" cy="90" r="10" fill="#1b2838"/>
  </svg>
);

export default function SteamConnectButton({ className = '', compact = false, label = 'Steam-ээр нэвтрэх' }) {
  const handleClick = () => {
    window.location.href = steamService.getLoginUrl();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Steam-ээр нэвтрэх"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b2838] hover:bg-[#2a475e] border border-[#4c6b8a]/50 hover:border-[#4c6b8a] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 ${className}`}
    >
      <SteamLogo size={compact ? 14 : 18} />
      {!compact && <span>{label}</span>}
    </button>
  );
}
