import React from 'react';

interface OfficialLogoSvgProps {
  className?: string;
  size?: number | string;
}

export const OfficialLogoSvg: React.FC<OfficialLogoSvgProps> = ({
  className = '',
  size = '100%',
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Curved Path for Top Text: TRUNG TÂM Y TẾ KHU VỰC */}
        <path
          id="topTextCurve"
          d="M 68 250 A 182 182 0 0 1 432 250"
          fill="none"
        />
        {/* Curved Path for Bottom Text: MỘC HÓA */}
        <path
          id="bottomTextCurve"
          d="M 125 330 A 180 180 0 0 0 375 330"
          fill="none"
        />
        {/* Clip path for the center inner circle to contain water waves */}
        <clipPath id="innerCircleClip">
          <circle cx="250" cy="250" r="158" />
        </clipPath>
      </defs>

      {/* 1. Outer White Base */}
      <circle cx="250" cy="250" r="240" fill="#FFFFFF" />

      {/* 2. Outer Navy Blue Ring */}
      <circle
        cx="250"
        cy="250"
        r="232"
        fill="none"
        stroke="#1E328A"
        strokeWidth="16"
      />

      {/* 3. Inner Thin Navy Ring */}
      <circle
        cx="250"
        cy="250"
        r="160"
        fill="#FFFFFF"
        stroke="#1E328A"
        strokeWidth="5"
      />

      {/* 4. Upper Text: TRUNG TÂM Y TẾ KHU VỰC */}
      <text
        fill="#1E328A"
        fontFamily="system-ui, -apple-system, sans-serif, Arial"
        fontSize="31"
        fontWeight="900"
        letterSpacing="3.5"
      >
        <textPath href="#topTextCurve" startOffset="50%" textAnchor="middle">
          TRUNG TÂM Y TẾ KHU VỰC
        </textPath>
      </text>

      {/* 5. Lower Text: MỘC HÓA */}
      <text
        fill="#E11D2A"
        fontFamily="system-ui, -apple-system, sans-serif, Arial"
        fontSize="44"
        fontWeight="950"
        letterSpacing="6"
      >
        <textPath href="#bottomTextCurve" startOffset="50%" textAnchor="middle">
          MỘC HÓA
        </textPath>
      </text>

      {/* 6. Side Accent Stripes (Left & Right 3 curved red stripes) */}
      {/* Left stripes */}
      <g stroke="#E11D2A" strokeWidth="5.5" fill="none" strokeLinecap="round">
        <path d="M 38 245 C 38 290 55 335 85 370" strokeWidth="6" />
        <path d="M 52 250 C 52 288 66 324 93 355" strokeWidth="5" />
        <path d="M 66 256 C 66 288 78 316 102 342" strokeWidth="4" />
      </g>

      {/* Right stripes */}
      <g stroke="#E11D2A" strokeWidth="5.5" fill="none" strokeLinecap="round">
        <path d="M 462 245 C 462 290 445 335 415 370" strokeWidth="6" />
        <path d="M 448 250 C 448 288 434 324 407 355" strokeWidth="5" />
        <path d="M 434 256 C 434 288 422 316 398 342" strokeWidth="4" />
      </g>

      {/* 7. Inside Center Elements (Clipped by inner circle) */}
      <g clipPath="url(#innerCircleClip)">
        {/* Horizontal Cyan/Blue Water Waves */}
        <g stroke="#009FE3" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M 90 270 Q 130 263 170 270 T 250 270 T 330 270 T 410 270" />
          <path d="M 85 285 Q 125 278 165 285 T 250 285 T 335 285 T 415 285" />
          <path d="M 85 300 Q 125 293 165 300 T 250 300 T 335 300 T 415 300" />
          <path d="M 95 315 Q 135 308 175 315 T 250 315 T 325 315 T 405 315" />
          <path d="M 110 330 Q 145 323 180 330 T 250 330 T 320 330 T 390 330" />
          <path d="M 130 345 Q 160 338 190 345 T 250 345 T 310 345 T 370 345" />
        </g>
      </g>

      {/* 8. Medical Cross Frame (Red Outline) */}
      <path
        d="M 210 130 H 290 V 165 H 335 V 245 H 290 V 305 H 210 V 245 H 165 V 165 H 210 Z"
        fill="#FFFFFF"
        stroke="#E11D2A"
        strokeWidth="11"
        strokeLinejoin="miter"
      />

      {/* 9. Lotus Flower inside the Cross */}
      <g fill="#E11D2A">
        {/* Center Main Lotus Bud */}
        <path d="M 250 170 C 238 192 238 214 250 226 C 262 214 262 192 250 170 Z" />

        {/* Petals Inner Left & Right */}
        <path d="M 250 226 C 232 222 222 198 232 180 C 242 198 248 216 250 226 Z" />
        <path d="M 250 226 C 268 222 278 198 268 180 C 258 198 252 216 250 226 Z" />

        {/* Petals Outer Left & Right */}
        <path d="M 250 226 C 215 220 205 186 215 174 C 224 196 238 218 250 226 Z" />
        <path d="M 250 226 C 285 220 295 186 285 174 C 276 196 262 218 250 226 Z" />

        {/* Petals Far Outer Wing Left & Right */}
        <path d="M 248 228 C 205 228 186 204 186 200 C 205 214 230 225 248 228 Z" />
        <path d="M 252 228 C 295 228 314 204 314 200 C 295 214 270 225 252 228 Z" />

        {/* Bottom Lotus Base Leaves */}
        <path d="M 250 234 C 225 234 202 245 198 252 C 220 248 240 238 250 234 Z" />
        <path d="M 250 234 C 275 234 298 245 302 252 C 280 248 260 238 250 234 Z" />
      </g>

      {/* 10. Supporting Cupped Hands (Solid Red with white outline separation) */}
      <path
        d="M 250 358 
           C 220 358 180 345 142 300 
           C 120 274 110 262 108 260 
           C 106 258 114 272 132 296 
           C 148 316 166 332 188 340 
           C 170 324 150 296 142 278 
           C 138 270 148 276 162 294 
           C 180 316 202 334 226 342 
           C 214 322 200 295 194 282 
           C 192 278 200 282 210 298 
           C 226 322 242 340 250 358 
           C 258 340 274 322 290 298 
           C 300 282 308 278 306 282 
           C 300 295 286 322 274 342 
           C 298 334 320 316 338 294 
           C 352 276 362 270 358 278 
           C 350 296 330 324 312 340 
           C 334 332 352 316 368 296 
           C 386 272 394 258 392 260 
           C 390 262 380 274 358 300 
           C 320 345 280 358 250 358 Z"
        fill="#E11D2A"
      />
      {/* Lower Solid Base of Hands */}
      <path
        d="M 188 340 C 218 368 250 376 250 376 C 250 376 282 368 312 340 C 285 390 215 390 188 340 Z"
        fill="#E11D2A"
      />
    </svg>
  );
};
