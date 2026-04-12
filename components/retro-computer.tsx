type RetroComputerProps = {
  className?: string;
  screenImageSrc?: string;
};

type KeySpec = {
  x: number;
  y: number;
  w: number;
  h?: number;
  dark?: boolean;
};

function buildRow(
  startX: number,
  y: number,
  widths: number[],
  h = 24,
  darkEdges = true
): KeySpec[] {
  let x = startX;

  return widths.map((w, index) => {
    const key: KeySpec = {
      x,
      y,
      w,
      h,
      dark: darkEdges && (index === 0 || index === widths.length - 1 || w >= 56),
    };

    x += w + 6;
    return key;
  });
}

const keys: KeySpec[] = [
  ...buildRow(10, 8, [48, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 48]),
  ...buildRow(30, 38, [56, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 56]),
  ...buildRow(46, 68, [66, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 66]),
  ...buildRow(10, 98, [52, 52, 52, 212, 52, 52, 52, 52, 52], 22),
];

const hiddenKeysForEnter = new Set([27, 39]);

export function RetroComputer({
  className,
  screenImageSrc,
}: RetroComputerProps) {
  return (
    <svg
      viewBox="0 0 1174 1024"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vintage beige CRT computer"
    >
      <defs>
        <linearGradient id="caseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6ccb8" />
          <stop offset="55%" stopColor="#cbbfa8" />
          <stop offset="100%" stopColor="#ae9e84" />
        </linearGradient>

        <linearGradient id="bezelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="38%" stopColor="#424446" />
          <stop offset="72%" stopColor="#6b6f72" />
          <stop offset="100%" stopColor="#9ea3a8" />
        </linearGradient>

        <radialGradient id="crtGlass" cx="40%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#cad6d7" />
          <stop offset="28%" stopColor="#b9c8ca" />
          <stop offset="58%" stopColor="#94a6a9" />
          <stop offset="82%" stopColor="#58686b" />
          <stop offset="100%" stopColor="#2d383a" />
        </radialGradient>

        <linearGradient id="crtDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
        </linearGradient>

        <linearGradient id="standGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b79f" />
          <stop offset="100%" stopColor="#8d7d64" />
        </linearGradient>

        <linearGradient id="kbdBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6ccb7" />
          <stop offset="52%" stopColor="#c8bda7" />
          <stop offset="100%" stopColor="#a69479" />
        </linearGradient>

        <linearGradient id="kbdTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9bea8" />
          <stop offset="100%" stopColor="#b4a286" />
        </linearGradient>

        <linearGradient id="keyLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6cdb8" />
          <stop offset="55%" stopColor="#c4b79d" />
          <stop offset="100%" stopColor="#8d7b63" />
        </linearGradient>

        <linearGradient id="keyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5a589" />
          <stop offset="100%" stopColor="#7e6d55" />
        </linearGradient>

        <linearGradient id="enterKeyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdbfa6" />
          <stop offset="55%" stopColor="#b29f81" />
          <stop offset="100%" stopColor="#7f6d54" />
        </linearGradient>

        <linearGradient id="mouseGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cdc2ad" />
          <stop offset="100%" stopColor="#9f8d73" />
        </linearGradient>

        <linearGradient id="slotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191919" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>

        <filter id="bodyShadow" x="-12%" y="-12%" width="124%" height="124%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="18"
            floodColor="#000000"
            floodOpacity="0.18"
          />
        </filter>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodColor="#000000"
            floodOpacity="0.18"
          />
        </filter>

        <filter id="keyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.2"
            floodColor="#000000"
            floodOpacity="0.22"
          />
        </filter>

        <filter id="screenImageSoften" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>

        <clipPath id="crtClip">
          <path d="M361 116 C507 106 720 106 860 116 C886 118 900 135 900 161 L892 487 C889 524 868 542 833 544 L390 544 C355 542 335 524 332 487 L324 161 C324 135 338 118 361 116 Z" />
        </clipPath>
      </defs>

      <g filter="url(#bodyShadow)">
        <rect x="255" y="32" width="747" height="714" rx="24" fill="url(#caseGrad)" />
        <path
          d="M971 47 C988 54 995 69 995 96 V685 C995 713 986 728 969 736 L969 47 Z"
          fill="#9a8b71"
          opacity="0.65"
        />
        <path
          d="M274 44 C263 55 260 79 260 114 V692 C260 713 268 727 284 736 L284 44 Z"
          fill="#efe5d1"
          opacity="0.55"
        />
        <rect x="272" y="729" width="713" height="13" rx="6.5" fill="#86765d" opacity="0.85" />
      </g>

      <g>
        <rect x="290" y="74" width="669" height="521" rx="19" fill="url(#bezelGrad)" />
        <path
          d="M308 92 H943 C949 92 953 96 953 102 V120 C953 112 946 106 934 106 H322 C313 106 307 111 307 119 V102 C307 96 302 92 308 92 Z"
          fill="#1f1f1f"
          opacity="0.96"
        />
        <path
          d="M933 107 C948 107 953 112 953 126 V562 C953 577 947 584 932 587 L932 107 Z"
          fill="#b1b6bb"
          opacity="0.82"
        />
        <path
          d="M322 107 C311 107 307 112 307 124 V561 C307 577 312 583 326 586 L326 107 Z"
          fill="#2c2c2c"
          opacity="0.88"
        />
        <path
          d="M325 585 H929 C943 585 951 579 953 565 V571 C953 584 944 593 931 593 H323 C312 593 307 587 307 576 V568 C309 580 316 585 325 585 Z"
          fill="#aab0b5"
          opacity="0.85"
        />
      </g>

      <g clipPath="url(#crtClip)">
        <path
          d="M361 116 C507 106 720 106 860 116 C886 118 900 135 900 161 L892 487 C889 524 868 542 833 544 L390 544 C355 542 335 524 332 487 L324 161 C324 135 338 118 361 116 Z"
          fill="url(#crtGlass)"
        />

        {screenImageSrc ? (
          <image
            href={screenImageSrc}
            x="324"
            y="116"
            width="576"
            height="430"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.88"
            filter="url(#screenImageSoften)"
          />
        ) : null}

        <path
          d="M339 120 C403 110 511 112 552 124 C570 129 570 148 560 186 C549 224 510 239 451 233 C396 228 360 205 344 173 C332 148 328 127 339 120 Z"
          fill="rgba(255,255,255,0.16)"
        />
        <path
          d="M371 552 C503 538 689 538 841 548 L841 566 C686 553 503 553 371 567 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M324 161 C324 135 338 118 361 116 C507 106 720 106 860 116 C886 118 900 135 900 161 L892 487 C889 524 868 542 833 544 L390 544 C355 542 335 524 332 487 Z"
          fill="url(#crtDark)"
          opacity="0.28"
        />
        <ellipse cx="804" cy="430" rx="74" ry="116" fill="rgba(22,28,29,0.22)" />
      </g>

      <path
        d="M361 116 C507 106 720 106 860 116 C886 118 900 135 900 161 L892 487 C889 524 868 542 833 544 L390 544 C355 542 335 524 332 487 L324 161 C324 135 338 118 361 116 Z"
        fill="none"
        stroke="rgba(12,16,18,0.55)"
        strokeWidth="4"
      />

      <g>
        <rect
          x="311"
          y="615"
          width="33"
          height="31"
          rx="3"
          fill="none"
          stroke="#6b614e"
          strokeWidth="3"
        />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={318 + col * 7}
              y={622 + row * 7}
              width="3.2"
              height="3.2"
              rx="0.5"
              fill="#7b715c"
            />
          ))
        )}

        <rect x="625" y="612" width="166" height="18" rx="9" fill="url(#slotGrad)" />
        <rect x="771" y="616" width="16" height="10" rx="2" fill="#2a2022" opacity="0.7" />

        <rect x="889" y="586" width="58" height="7" rx="3.5" fill="#6f6552" />
        <rect x="892" y="588" width="52" height="3" rx="1.5" fill="#ddd2bd" opacity="0.7" />

        <g filter="url(#softShadow)">
          <g transform="translate(852 625)">
            <ellipse cx="17" cy="12" rx="15" ry="11.5" fill="#8c7d64" />
            <ellipse cx="15" cy="10.5" rx="15" ry="11.5" fill="url(#kbdBody)" />
            <circle cx="10" cy="8" r="3.4" fill="#8f7c63" />
          </g>

          <g transform="translate(895 617)">
            <circle cx="22" cy="18" r="18" fill="#8e7d63" />
            <circle cx="19" cy="15" r="18" fill="url(#kbdBody)" />
            <circle cx="19" cy="15" r="9.5" fill="none" stroke="#7c6c54" strokeWidth="3" />
            <circle cx="13.5" cy="9.5" r="3.5" fill="rgba(255,255,255,0.45)" />
          </g>
        </g>
      </g>

      <g filter="url(#softShadow)">
        <path
          d="M394 744 H862 C874 744 883 753 883 765 V795 H373 V765 C373 753 382 744 394 744 Z"
          fill="url(#standGrad)"
        />
        <rect x="408" y="744" width="14" height="55" rx="4" fill="#2f2b26" />
        <rect x="814" y="744" width="14" height="55" rx="4" fill="url(#standGrad)" opacity="0" />
        <rect x="814" y="744" width="14" height="55" rx="4" fill="#2f2b26" />
        <rect x="379" y="789" width="498" height="10" rx="5" fill="#8c7d62" />
      </g>

      <g>
        <path
          d="M1008 928 C1038 916 1068 922 1086 946 C1098 962 1098 981 1087 991 C1074 1003 1051 1007 1027 1001 C1003 995 989 980 988 961 C987 946 995 935 1008 928 Z"
          fill="url(#mouseGrad)"
        />
        <path
          d="M1000 956 C1007 977 1038 994 1073 991 C1064 999 1048 1004 1027 1001 C1003 995 989 980 988 961 C987 951 990 943 996 937 C995 945 996 951 1000 956 Z"
          fill="rgba(0,0,0,0.28)"
        />
        <path
          d="M1017 935 C1038 929 1062 932 1075 946"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <g filter="url(#bodyShadow)">
        <path
          d="M304 772 H952 C984 772 1007 790 1014 821 L1048 948 C1054 981 1033 1002 997 1002 H259 C223 1002 202 980 208 947 L242 821 C249 790 272 772 304 772 Z"
          fill="url(#kbdBody)"
        />
        <path
          d="M286 820 H970 C984 820 995 830 998 844 L1016 908 C1020 923 1009 934 993 934 H263 C247 934 236 923 240 907 L258 844 C261 830 272 820 286 820 Z"
          fill="url(#kbdTop)"
        />
        <path
          d="M259 1001 H997 C1031 1001 1051 983 1047 952 L1044 941 C1042 966 1022 978 995 978 H261 C232 978 212 965 210 940 L206 951 C201 981 223 1001 259 1001 Z"
          fill="#8f7e64"
          opacity="0.8"
        />
      </g>

      <g>
        <path
          d="M278 809 H978 C992 809 1003 819 1006 833 L1021 904 C1025 920 1014 931 998 931 H258 C242 931 231 920 235 904 L250 833 C253 819 264 809 278 809 Z"
          fill="#aa987d"
          opacity="0.7"
        />

        <g transform="translate(280 806)">
          {keys.map((key, index) => {
            if (hiddenKeysForEnter.has(index)) return null;

            return (
              <g key={index} filter="url(#keyShadow)">
                <rect
                  x={key.x}
                  y={key.y}
                  width={key.w}
                  height={key.h ?? 24}
                  rx="3.5"
                  fill={key.dark ? "url(#keyDark)" : "url(#keyLight)"}
                />
                <rect
                  x={key.x + 1.5}
                  y={key.y + 1.5}
                  width={Math.max(2, key.w - 3)}
                  height={Math.max(2, (key.h ?? 24) - 7)}
                  rx="2.5"
                  fill="rgba(255,255,255,0.16)"
                />
                {key.w <= 52 ? (
                  <>
                    <rect
                      x={key.x + key.w / 2 - 6}
                      y={key.y + 7}
                      width="12"
                      height="2"
                      rx="1"
                      fill="rgba(92,78,58,0.38)"
                    />
                    <rect
                      x={key.x + key.w / 2 - 3}
                      y={key.y + 12}
                      width="6"
                      height="2"
                      rx="1"
                      fill="rgba(92,78,58,0.28)"
                    />
                  </>
                ) : null}
              </g>
            );
          })}

          <g filter="url(#keyShadow)">
            <rect x="576" y="38" width="38" height="24" rx="3.5" fill="url(#keyLight)" />
            <rect
              x="577.5"
              y="39.5"
              width="35"
              height="17"
              rx="2.5"
              fill="rgba(255,255,255,0.16)"
            />
            <rect
              x="585"
              y="45"
              width="12"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.38)"
            />
            <rect
              x="588"
              y="50"
              width="6"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.28)"
            />
          </g>

          <g filter="url(#keyShadow)">
            <rect x="558" y="68" width="38" height="24" rx="3.5" fill="url(#keyLight)" />
            <rect
              x="559.5"
              y="69.5"
              width="35"
              height="17"
              rx="2.5"
              fill="rgba(255,255,255,0.16)"
            />
            <rect
              x="567"
              y="75"
              width="12"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.38)"
            />
            <rect
              x="570"
              y="80"
              width="6"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.28)"
            />
          </g>

          <g filter="url(#keyShadow)">
            <rect x="602" y="68" width="38" height="24" rx="3.5" fill="url(#keyLight)" />
            <rect
              x="603.5"
              y="69.5"
              width="35"
              height="17"
              rx="2.5"
              fill="rgba(255,255,255,0.16)"
            />
            <rect
              x="611"
              y="75"
              width="12"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.38)"
            />
            <rect
              x="614"
              y="80"
              width="6"
              height="2"
              rx="1"
              fill="rgba(92,78,58,0.28)"
            />
          </g>

          <g filter="url(#keyShadow)">
            <path
              d="M636 38
                 H679
                 Q684 38 684 43
                 V87
                 Q684 92 679 92
                 H653
                 Q648 92 648 87
                 V67
                 Q648 62 643 62
                 H636
                 Q631 62 631 57
                 V43
                 Q631 38 636 38 Z"
              fill="url(#enterKeyGrad)"
            />

            <path
              d="M637.5 39.5
                 H677.5
                 Q681.5 39.5 681.5 43.5
                 V84.5
                 Q681.5 88.5 677.5 88.5
                 H654.5
                 Q650.5 88.5 650.5 84.5
                 V68.5
                 Q650.5 64.5 645.5 64.5
                 H637.5
                 Q633.5 64.5 633.5 60.5
                 V43.5
                 Q633.5 39.5 637.5 39.5 Z"
              fill="rgba(255,255,255,0.13)"
            />

            <path
              d="M652 86 C658 88 668 88 680 86"
              fill="none"
              stroke="rgba(0,0,0,0.10)"
              strokeWidth="2.1"
              strokeLinecap="round"
            />

            <path
              d="M663 44.5 V51.5 H652"
              fill="none"
              stroke="rgba(92,78,58,0.56)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M656.8 48.3 L652 51.5 L656.8 54.7"
              fill="none"
              stroke="rgba(92,78,58,0.56)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>

      <path
        d="M276 46 H964"
        stroke="rgba(255,255,255,0.30)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M304 786 H952"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
