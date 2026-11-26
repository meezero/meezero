/* =========================================================
   월넛 픽셀 서재 — 픽셀 방 렌더러
   160x176 논리 픽셀 캔버스를 CSS로 확대해 그립니다.
   ========================================================= */
(function () {
  'use strict';

  const W = 160;
  const H = 176;

  const P = {
    ink: '#1B110B', night: '#2B1D14', night2: '#241710',
    wall: '#936C4C', wallD: '#886246', wallDD: '#795540',
    base: '#2B1D14', baseHi: '#6E4A32',
    floorA: '#4E3423', floorB: '#563A27', floorSeam: '#38241A', floorHi: '#6A472F',
    woodD: '#4A3121', wood: '#6E4A32', woodL: '#8A5F3F', woodLL: '#A97C55',
    brass: '#D9A760', brassL: '#F0D9A8', brassD: '#8A641F',
    cream: '#F4E9D8', cream2: '#E8D9BE', cream3: '#C4B49A',
    green: '#7A9A65', greenD: '#5E7A4C',
    retro: '#C95D4B', retroD: '#A94B3C', retroDD: '#8C3C2E',
    cork: '#B07A4A', corkD: '#9C6A3E',
    teddy: '#C08F5E', teddyD: '#9A6B40', teddyL: '#E8CFA8',
    skin: '#F2D3B0', skinD: '#E0B98F', hair: '#2B1D14',
    // 진한 다크 월넛 책상
    deskTop: '#3A2115', deskL: '#4E2F20', deskD: '#2D180E', deskDD: '#1F1009', deskHi: '#6A4530',
    // 레트로 머스타드 브라운관 TV 본체
    tvY: '#D19A2E', tvYL: '#E8B84B', tvYD: '#9E6E1B', tvYDD: '#7A5412',
    // 깊은 버건디 빈백
    bean: '#7C2E2B', beanL: '#963F3B', beanD: '#591D1B',
    // 채도 낮은 세이지 그린 러그
    sage: '#4E6851', sageL: '#647F63', sageD: '#3A4F3D'
  };

  function create(canvas) {
    const ctx = canvas.getContext('2d');
    const base = document.createElement('canvas');
    base.width = W;
    base.height = H;
    const b = base.getContext('2d');

    let G = b; // 현재 그리기 대상 (정적: base, 동적: 화면)
    const px = (x, y, w, h, c) => { G.fillStyle = c; G.fillRect(x, y, w, h); };

    /* ---------------- 벽과 바닥 ---------------- */
    function drawWall() {
      px(0, 0, W, 2, P.night2);
      px(0, 2, W, 2, '#5C3D28');
      px(0, 4, W, 1, P.woodL);
      px(0, 5, W, 51, P.wall);
      for (let x = 0; x < W; x += 8) px(x, 5, 1, 51, P.wallD);
      // 벽지의 은은한 결
      for (let y = 12; y < 56; y += 8) {
        for (let x = (y % 16) ? 3 : 7; x < W; x += 16) px(x, y, 2, 1, P.wallDD);
      }
      // 걸레받이
      px(0, 56, W, 2, P.wood);
      px(0, 58, W, 6, P.base);
      px(0, 58, W, 1, '#3A2718');
    }

    function drawFloor() {
      px(0, 64, W, H - 64, P.floorA);
      let row = 0;
      for (let y = 64; y < H; y += 14, row++) {
        px(0, y, W, 14, row % 2 ? P.floorB : P.floorA);
        px(0, y, W, 1, P.floorSeam);
        px(0, y + 1, W, 1, P.floorHi);
        const off = (row * 37) % 64;
        for (let x = off; x < W; x += 64) {
          px(x, y + 2, 1, 4, P.floorSeam);
        }
        px(6 + ((row * 17) % 34), y + 6, 8, 1, '#5C3D28');
        px(74 + ((row * 23) % 60), y + 10, 6, 1, '#452E20');
        px(20 + ((row * 29) % 90), y + 12, 4, 1, '#5C3D28');
      }
      // 벽 쪽 그늘 (원근감)
      for (let i = 0; i < 12; i++) {
        G.fillStyle = `rgba(27,17,11,${0.13 - i * 0.01})`;
        G.fillRect(0, 64 + i, W, 1);
      }
    }

    /* ---------------- 창문 (오른쪽 벽) ---------------- */
    function drawWindow() {
      // 커튼
      px(104, 8, 5, 34, P.retroD);
      px(105, 8, 2, 34, P.retro);
      px(107, 8, 2, 34, P.retroDD);
      px(138, 8, 5, 34, P.retroD);
      px(139, 8, 2, 34, P.retro);
      px(141, 8, 2, 34, P.retroDD);
      px(104, 26, 5, 2, P.brass);
      px(138, 26, 5, 2, P.brass);
      // 창틀
      px(109, 7, 29, 37, P.wood);
      px(110, 8, 27, 2, P.woodL);
      px(110, 8, 1, 34, P.woodL);
      px(110, 40, 27, 2, P.woodD);
      // 밤하늘
      px(112, 10, 23, 30, '#161019');
      px(112, 10, 23, 10, '#1F1620');
      px(112, 10, 23, 1, '#2B1D14');
      // 별
      [[115, 14], [121, 18], [133, 21], [117, 24], [124, 29], [131, 34], [113, 33], [119, 21], [130, 15]]
        .forEach(([x, y]) => px(x, y, 1, 1, P.cream));
      px(118, 27, 1, 1, P.brassL);
      px(132, 30, 1, 1, P.brassL);
      // 달 (동그란 픽셀 달)
      px(127, 12, 3, 1, P.brassL);
      px(126, 13, 5, 3, P.brassL);
      px(127, 16, 3, 1, P.brassL);
      px(127, 13, 2, 2, P.cream);
      px(126, 15, 1, 1, '#C9A05E');
      // 창틀 살
      px(122, 10, 2, 30, P.wood);
      px(112, 23, 23, 2, P.wood);
      px(123, 10, 1, 30, P.woodL);
      // 창턱
      px(107, 41, 33, 2, P.woodL);
      px(106, 43, 35, 3, P.woodD);
      px(108, 43, 31, 1, '#3A2718');
    }

    /* ---------------- 벽면 달력 ---------------- */
    function drawCalendar() {
      px(81, 12, 22, 26, P.woodD);
      px(82, 13, 20, 24, P.cream);
      px(82, 13, 20, 6, P.retro);
      px(82, 13, 20, 1, '#E07A67');
      // '11' 표시
      px(85, 15, 1, 3, P.cream);
      px(87, 15, 1, 3, P.cream);
      px(88, 15, 1, 1, P.cream);
      // 격자
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) px(85 + c * 4, 21 + r * 3, 1, 1, P.cream3);
      }
      px(93, 24, 2, 2, P.retro);
      px(89, 30, 4, 1, P.green);
      // 고리
      px(85, 11, 1, 2, P.brass);
      px(91, 11, 1, 2, P.brass);
      px(97, 11, 1, 2, P.brass);
      px(81, 38, 22, 1, 'rgba(27,17,11,0.22)');
    }

    /* ---------------- 코르크 보드 ---------------- */
    function drawCork() {
      px(42, 9, 37, 32, P.woodD);
      px(43, 10, 35, 30, P.wood);
      px(44, 11, 33, 28, P.cork);
      for (let i = 0; i < 80; i++) {
        const x = 44 + ((i * 37) % 33);
        const y = 11 + ((i * 53) % 28);
        px(x, y, 1, 1, i % 3 ? P.corkD : '#C08A54');
      }
      // 메모
      px(47, 14, 9, 10, P.cream);
      px(47, 14, 9, 1, '#FFF8EA');
      px(49, 17, 5, 1, P.cream3);
      px(49, 19, 4, 1, P.cream3);
      px(49, 21, 5, 1, P.cream3);
      px(58, 13, 8, 10, '#E8B4A4');
      px(60, 16, 4, 1, '#B9756B');
      px(60, 18, 5, 1, '#B9756B');
      px(60, 20, 4, 1, '#B9756B');
      px(67, 22, 8, 8, '#D7DEBF');
      px(69, 24, 4, 1, P.greenD);
      px(69, 26, 5, 1, P.greenD);
      // 사진
      px(51, 27, 9, 9, P.woodL);
      px(52, 28, 7, 7, P.woodD);
      px(54, 29, 3, 3, P.brass);
      px(53, 32, 5, 2, P.cream2);
      // 압정
      px(50, 14, 2, 2, P.retro);
      px(62, 13, 2, 2, P.brass);
      px(70, 22, 2, 2, P.green);
      px(55, 27, 2, 2, P.brass);
      // 낙서
      px(64, 33, 3, 1, P.retro);
      px(63, 32, 1, 1, P.retro);
    }

    /* ---------------- 오른쪽 벽 선반 (곰인형 · 소품) ---------------- */
    function drawShelf() {
      // 위 선반 (창문 오른쪽 기둥) — 곰인형이 올라앉아요
      px(144, 30, 16, 3, P.wood);
      px(144, 30, 16, 1, P.woodL);
      px(144, 33, 16, 1, P.woodD);
      px(146, 33, 2, 4, P.woodD);
      px(156, 33, 2, 4, P.woodD);
      // 아래 선반 (창턱과 이어짐)
      px(142, 44, 18, 3, P.wood);
      px(142, 44, 18, 1, P.woodL);
      px(142, 47, 18, 1, P.woodD);
      // 아래 선반 위 소품: 책 한 줌 + 화분
      px(145, 38, 3, 6, P.retro);
      px(145, 38, 3, 1, '#E07A67');
      px(148, 39, 3, 5, P.green);
      px(148, 39, 3, 1, '#95B37E');
      px(151, 40, 2, 4, P.brass);
      px(154, 41, 5, 3, P.retro);
      px(154, 41, 5, 1, P.retroD);
      px(155, 37, 1, 4, P.green);
      px(157, 36, 1, 5, P.green);
      px(156, 38, 2, 1, P.green);
      px(155, 40, 2, 1, P.greenD);
    }

    /* ---------------- 왼쪽: 액자 · 벽걸이 수납장 (바로가기) ---------------- */
    function drawNook() {
      // 벽에 건 액자
      px(3, 8, 19, 17, P.woodD);
      px(4, 9, 17, 15, P.wood);
      px(4, 9, 17, 1, P.woodL);
      px(6, 11, 13, 11, '#EFE3CB');
      // 액자 속: 크림 배경 위 픽셀 하트 (로고 도트)
      px(7, 12, 11, 9, '#EFE3CB');
      px(7, 12, 11, 1, '#FFF8EA');
      px(12, 13, 2, 1, P.retro);
      px(15, 13, 2, 1, P.retro);
      px(11, 14, 7, 2, P.retro);
      px(12, 16, 5, 1, P.retro);
      px(13, 17, 3, 1, P.retro);
      px(14, 18, 1, 1, P.retroD);
      px(12, 14, 1, 1, '#E07A67');
      px(13, 13, 1, 1, '#E07A67');
      // 벽걸이 수납장
      px(3, 28, 34, 20, P.woodD);
      px(4, 29, 32, 18, P.wood);
      px(4, 29, 32, 1, P.woodL);
      px(4, 46, 32, 1, '#3A2718');
      // 안쪽 두 칸
      px(6, 31, 28, 6, '#2A1C12');
      px(6, 39, 28, 6, '#2A1C12');
      // 가운데 선반 판
      px(5, 37, 30, 2, P.woodL);
      px(5, 37, 30, 1, '#C09468');
      // 위칸: 책 세 권 + 편지
      px(8, 31, 3, 6, P.retro);
      px(8, 31, 3, 1, '#E07A67');
      px(11, 32, 2, 5, P.brass);
      px(13, 31, 3, 6, P.green);
      px(13, 31, 3, 1, '#95B37E');
      // 편지 봉투
      px(20, 32, 10, 5, '#EFE3CB');
      px(20, 32, 10, 1, '#FFF8EA');
      px(20, 36, 10, 1, '#C9B693');
      px(24, 33, 2, 1, '#C9B693');
      px(23, 34, 1, 1, '#C9B693');
      px(25, 34, 1, 1, '#C9B693');
      // 아래칸: 작은 모니터(로고 도트)
      px(9, 39, 13, 6, P.woodL);
      px(9, 39, 13, 1, '#C09468');
      px(10, 40, 11, 4, P.night);
      px(11, 41, 3, 1, P.green);
      px(11, 42, 6, 1, P.brass);
      px(14, 45, 3, 1, P.woodD);
      // 메모 카드
      px(24, 39, 9, 6, '#D7DEBF');
      px(26, 41, 5, 1, P.greenD);
      px(26, 43, 4, 1, P.greenD);
    }

    /* ---------------- 러그 (세이지 그린) ---------------- */
    function drawRug() {
      px(42, 127, 58, 2, 'rgba(27,17,11,0.22)');
      px(44, 128, 54, 36, P.sageD);
      px(45, 129, 52, 34, P.sage);
      px(47, 131, 48, 30, P.cream2);
      px(48, 132, 46, 28, P.cream);
      // 테두리 무늬
      for (let x = 50; x < 94; x += 4) {
        px(x, 130, 2, 1, P.sageL);
        px(x, 160, 2, 1, P.sageL);
      }
      // 중앙 메달리온
      const cx = 71;
      const cy = 146;
      px(cx - 1, cy - 7, 2, 1, P.sage);
      px(cx - 2, cy - 6, 4, 1, P.sage);
      px(cx - 3, cy - 5, 6, 1, P.sage);
      px(cx - 4, cy - 4, 8, 1, P.sage);
      px(cx - 5, cy - 3, 10, 1, P.sage);
      px(cx - 6, cy - 2, 12, 1, P.sage);
      px(cx - 7, cy - 1, 14, 2, P.sage);
      px(cx - 6, cy + 1, 12, 1, P.sage);
      px(cx - 5, cy + 2, 10, 1, P.sage);
      px(cx - 4, cy + 3, 8, 1, P.sage);
      px(cx - 3, cy + 4, 6, 1, P.sage);
      px(cx - 2, cy + 5, 4, 1, P.sage);
      px(cx - 1, cy + 6, 2, 1, P.sage);
      px(cx - 1, cy - 1, 2, 2, P.sageL);
      px(cx - 4, cy - 3, 2, 1, P.sageL);
      px(cx + 2, cy + 2, 2, 1, P.sageD);
      // 작은 다이아몬드
      [[54, 141], [88, 141], [54, 153], [88, 153]].forEach(([x, y]) => {
        px(x, y, 2, 1, P.sageD);
        px(x - 1, y + 1, 4, 1, P.sageL);
        px(x, y + 2, 2, 1, P.sageD);
      });
      // 술
      for (let x = 46; x < 98; x += 3) {
        px(x, 126, 1, 2, P.cream3);
        px(x, 164, 1, 3, P.cream3);
      }
    }

    /* ---------------- 책상 ---------------- */
    function drawDesk() {
      // 책상 그림자
      G.fillStyle = 'rgba(27,17,11,0.28)';
      G.fillRect(12, 117, 66, 3);
      // 책상 앞 원목 스툴
      G.fillStyle = 'rgba(27,17,11,0.26)';
      G.fillRect(40, 119, 18, 2);
      px(41, 106, 16, 3, P.woodL);
      px(41, 106, 16, 1, P.woodLL);
      px(42, 109, 14, 2, P.wood);
      px(43, 109, 12, 1, P.cream2);
      px(43, 111, 2, 8, P.woodD);
      px(53, 111, 2, 8, P.woodD);
      px(45, 111, 2, 3, P.wood);
      px(51, 111, 2, 3, P.wood);
      // 다리 (진한 월넛)
      px(13, 96, 4, 21, P.deskD);
      px(13, 96, 1, 21, P.deskL);
      px(71, 96, 4, 21, P.deskD);
      px(74, 96, 1, 21, P.deskL);
      // 상판 (다크 월넛 · 위쪽 모서리 하이라이트로 마루와 구분)
      px(11, 84, 67, 8, P.deskTop);
      px(11, 84, 67, 2, P.deskL);
      px(11, 86, 67, 1, P.deskHi);
      px(11, 91, 67, 1, P.deskDD);
      px(11, 92, 67, 4, P.deskD);
      px(12, 93, 65, 1, P.deskDD);
      // 서랍
      px(33, 93, 22, 3, P.deskTop);
      px(33, 93, 22, 1, P.deskHi);
      px(42, 94, 3, 2, P.brass);
      // 종이
      px(13, 78, 11, 6, P.cream);
      px(13, 78, 11, 1, '#FFF8EA');
      px(15, 80, 7, 1, P.cream3);
      px(15, 82, 6, 1, P.cream3);
      // 노트북
      px(24, 69, 19, 14, P.woodD);
      px(25, 70, 17, 12, P.ink);
      px(26, 71, 15, 10, P.night);
      px(27, 72, 13, 1, '#3A2718');
      px(28, 75, 7, 1, P.green);
      px(28, 77, 10, 1, P.brass);
      px(28, 79, 5, 1, '#8F7A5E');
      px(27, 80, 1, 1, P.cream3);
      px(38, 72, 1, 1, P.brassL);
      px(22, 82, 23, 3, '#B9B2A4');
      px(22, 82, 23, 1, '#D6D0C2');
      px(25, 84, 17, 1, '#8E8779');
      // 머그
      px(48, 77, 6, 7, P.cream);
      px(48, 77, 6, 1, '#FFF8EA');
      px(49, 78, 4, 1, '#5C3D28');
      px(54, 78, 2, 4, P.cream2);
      px(55, 79, 1, 2, P.cream);
      // 스탠드
      px(59, 81, 10, 3, P.brass);
      px(59, 81, 10, 1, P.brassL);
      px(63, 72, 2, 9, P.brassD);
      px(64, 72, 1, 9, P.brass);
      px(57, 67, 13, 4, P.brass);
      px(57, 67, 13, 1, P.brassL);
      px(58, 71, 11, 1, P.brassD);
      px(62, 72, 3, 3, '#FFF3D4');
      // 책 한 권
      px(14, 82, 6, 2, P.retro);
      px(14, 82, 6, 1, '#E07A67');
    }

    /* ---------------- 바구니 ---------------- */
    function drawBasket() {
      px(76, 111, 24, 3, 'rgba(27,17,11,0.25)');
      // 안에 든 것
      px(81, 92, 7, 5, P.cream);
      px(81, 92, 7, 1, '#FFF8EA');
      px(83, 94, 4, 1, P.cream3);
      px(89, 91, 4, 6, P.green);
      px(90, 93, 2, 2, P.greenD);
      px(93, 93, 3, 5, P.retro);
      px(93, 92, 3, 1, '#E07A67');
      // 몸통
      px(79, 96, 20, 15, P.cork);
      px(80, 97, 18, 13, '#C08A54');
      px(78, 95, 22, 3, P.wood);
      px(78, 95, 22, 1, P.woodL);
      px(79, 98, 1, 13, P.corkD);
      px(98, 98, 1, 13, P.corkD);
      for (let y = 99; y < 111; y += 3) px(81, y, 16, 1, P.corkD);
      for (let x = 82; x < 97; x += 3) px(x, 98, 1, 13, '#B07A4A');
      // 손잡이
      px(81, 94, 2, 2, P.brassD);
      px(95, 94, 2, 2, P.brassD);
    }

    /* ---------------- 빈백 (딥 버건디) · 바닥 램프 ---------------- */
    function drawBeanbag() {
      // 바닥 그림자
      G.fillStyle = 'rgba(27,17,11,0.30)';
      G.fillRect(97, 120, 52, 4);

      // 몸통: 바닥에 풍 덩이진 둥근 덩어리 (납작한 빈백)
      const rows = [
        [96, 116, 16], [97, 112, 24], [98, 109, 30], [99, 107, 34],
        [100, 105, 38], [101, 104, 40], [102, 103, 42], [103, 102, 44],
        [104, 101, 45], [105, 100, 47], [106, 100, 47], [107, 100, 47],
        [108, 99, 48], [109, 99, 48], [110, 99, 48], [111, 99, 48],
        [112, 99, 48], [113, 99, 48], [114, 100, 47], [115, 100, 47],
        [116, 101, 46], [117, 102, 44], [118, 104, 41], [119, 106, 38],
        [120, 109, 34], [121, 112, 28]
      ];
      rows.forEach(([y, x, w]) => px(x, y, w, 1, P.bean));
      // 맨 윗면만 부드럽게 밝게
      rows.slice(0, 2).forEach(([y, x, w]) => px(x, y, w, 1, P.beanL));
      px(104, 102, 2, 14, P.beanL);
      // 오른쪽 · 아래 그늘
      rows.forEach(([y, x, w]) => px(x + w - 4, y, 4, 1, P.beanD));
      rows.slice(-3).forEach(([y, x, w]) => px(x, y, w, 1, P.beanD));
      // 푹 꺼진 주름
      px(106, 100, 1, 14, P.beanD);
      px(112, 102, 1, 15, P.beanD);
      px(120, 103, 1, 15, P.beanD);
      px(129, 104, 1, 14, P.beanD);
      px(138, 102, 1, 13, P.beanD);
      px(117, 98, 1, 6, P.beanL);
      px(126, 99, 1, 7, P.beanL);
      px(135, 100, 1, 6, P.beanL);
      px(143, 105, 1, 8, P.beanL);
      // 곰이 앉아서 눌린 자리
      px(115, 96, 16, 1, P.beanD);
      px(118, 97, 11, 1, P.beanD);

      // 바닥 램프 (빈백 뒤 오른쪽 · 빈 벽 채우기)
      px(147, 89, 6, 3, P.brassD);
      px(148, 87, 4, 3, P.brassD);
      px(149, 64, 1, 24, P.brassD);
      px(148, 64, 1, 24, P.brass);
      px(143, 56, 11, 8, '#E8C48C');
      px(143, 56, 11, 1, '#FFF3D4');
      px(142, 63, 13, 1, P.brass);
      px(144, 64, 9, 1, P.brassD);
      px(146, 58, 2, 4, '#FFF3D4');
    }

    /* ---------------- 브라운관 TV ---------------- */
    function drawTV() {
      // 캐비닛
      px(99, 170, 52, 3, 'rgba(27,17,11,0.3)');
      px(100, 150, 48, 20, P.woodD);
      px(100, 149, 48, 2, P.wood);
      px(100, 149, 48, 1, P.woodL);
      px(104, 156, 19, 11, P.wood);
      px(104, 156, 19, 1, P.woodL);
      px(112, 159, 4, 2, P.brass);
      px(126, 156, 18, 11, P.wood);
      px(126, 156, 18, 1, P.woodL);
      px(132, 159, 5, 2, P.brass);
      // 본체 (레트로 머스타드 옐로)
      px(104, 128, 38, 22, P.tvYDD);
      px(105, 127, 36, 21, P.tvY);
      px(105, 127, 36, 2, P.tvYL);
      px(105, 129, 1, 19, P.tvYL);
      px(139, 129, 1, 19, P.tvYD);
      px(105, 146, 34, 2, P.tvYD);
      px(106, 130, 2, 17, P.tvYD);
      // 화면 테두리
      px(108, 130, 26, 16, P.ink);
      px(109, 131, 24, 14, P.night);
      // 버튼 (노란 본체 위라 진한 나무색)
      px(136, 131, 4, 4, '#4A3121');
      px(137, 132, 2, 2, P.deskD);
      px(136, 136, 4, 4, '#4A3121');
      px(137, 137, 2, 2, P.deskD);
      for (let y = 141; y < 147; y += 2) px(136, y, 5, 1, P.tvYD);
      // 안테나
      px(113, 123, 1, 5, P.brass);
      px(112, 120, 1, 3, P.brass);
      px(111, 118, 1, 2, P.brass);
      px(123, 122, 1, 6, P.brass);
      px(124, 119, 1, 3, P.brass);
      px(125, 117, 1, 2, P.brass);
    }

    /* ---------------- 화분 · 책 ---------------- */
    function drawPlant() {
      px(3, 170, 18, 2, 'rgba(27,17,11,0.28)');
      px(6, 158, 13, 12, P.retro);
      px(6, 158, 13, 1, '#E07A67');
      px(5, 156, 15, 3, P.retroD);
      px(7, 162, 1, 7, P.retroDD);
      px(8, 165, 9, 1, P.retroDD);
      // 잎
      px(11, 143, 2, 14, P.greenD);
      px(8, 147, 4, 2, P.green);
      px(13, 150, 4, 2, P.green);
      px(7, 140, 4, 6, P.green);
      px(12, 137, 4, 8, P.green);
      px(15, 134, 3, 6, P.green);
      px(5, 150, 3, 3, P.green);
      px(16, 142, 2, 3, P.greenD);
      px(9, 154, 2, 2, P.greenD);
      // 화분 무늬
      px(9, 159, 1, 1, P.cream2);
      px(13, 163, 2, 1, P.cream2);
      // 바닥 푸프 (둥근 오토만)
      G.fillStyle = 'rgba(27,17,11,0.26)';
      G.fillRect(25, 151, 18, 2);
      px(30, 139, 6, 1, P.retroD);
      px(27, 140, 12, 1, P.retro);
      px(25, 141, 16, 1, P.retro);
      px(24, 142, 18, 7, P.retro);
      px(25, 149, 16, 1, P.retro);
      px(27, 150, 12, 1, P.retroD);
      px(30, 151, 6, 1, P.retroD);
      px(26, 142, 14, 1, '#E07A67');
      px(25, 146, 16, 1, '#B4553F');
      px(29, 143, 2, 1, P.cream2);
      px(36, 147, 3, 1, P.cream3);
      px(4, 158, 11, 2, P.green);
      px(5, 156, 9, 2, P.brass);
      px(5, 160, 9, 2, P.retro);
      px(6, 157, 1, 1, P.cream3);
    }

    /* ---------------- 기타 디테일 ---------------- */
    function drawDetails() {
      // 벽 콘센트
      px(70, 51, 5, 5, P.cream2);
      px(71, 52, 1, 2, P.woodD);
      px(73, 52, 1, 2, P.woodD);
      // 창가 바닥 빛 (오른쪽 창문에서)
      G.fillStyle = 'rgba(200,214,238,0.05)';
      G.beginPath();
      G.moveTo(112, 65); G.lineTo(150, 65); G.lineTo(146, 98); G.lineTo(96, 98);
      G.closePath(); G.fill();
      // 러그 밑 그늘
      px(44, 164, 54, 2, 'rgba(27,17,11,0.20)');
    }

    /* ---------------- 동적: 곰인형 ---------------- */
    function teddyBig(x, y, opts) {
      const { blink = false, hop = 0 } = opts || {};
      const yy = y - hop;
      G.fillStyle = 'rgba(27,17,11,0.25)';
      G.fillRect(x + 2, y + 25, 15, 2);
      // 귀
      px(x + 3, yy - 1, 4, 4, P.teddy);
      px(x + 12, yy - 1, 4, 4, P.teddy);
      px(x + 4, yy, 2, 2, P.teddyL);
      px(x + 13, yy, 2, 2, P.teddyL);
      // 머리
      px(x + 4, yy + 1, 11, 9, P.teddy);
      px(x + 4, yy + 1, 11, 1, '#D2A276');
      px(x + 4, yy + 2, 1, 7, '#D2A276');
      // 주둥이
      px(x + 6, yy + 6, 7, 4, P.teddyL);
      px(x + 8, yy + 6, 3, 2, P.ink);
      px(x + 9, yy + 8, 1, 1, '#B98A5C');
      // 눈
      if (blink) {
        px(x + 5, yy + 4, 2, 1, P.ink);
        px(x + 12, yy + 4, 2, 1, P.ink);
      } else {
        px(x + 5, yy + 4, 1, 2, P.ink);
        px(x + 13, yy + 4, 1, 2, P.ink);
      }
      px(x + 6, yy + 3, 1, 1, P.ink);
      px(x + 12, yy + 3, 1, 1, P.ink);
      // 볼
      px(x + 5, yy + 7, 1, 1, '#E0A88B');
      px(x + 13, yy + 7, 1, 1, '#E0A88B');
      // 몸통
      px(x + 3, yy + 10, 13, 10, P.teddy);
      px(x + 5, yy + 12, 9, 7, P.teddyL);
      px(x + 3, yy + 10, 1, 10, '#D2A276');
      // 팔
      px(x, yy + 10, 3, 8, P.teddy);
      px(x + 16, yy + 10, 3, 8, P.teddy);
      px(x, yy + 17, 3, 2, P.teddyL);
      px(x + 16, yy + 17, 3, 2, P.teddyL);
      // 다리
      px(x + 3, yy + 19, 5, 5, P.teddy);
      px(x + 11, yy + 19, 5, 5, P.teddy);
      px(x + 3, yy + 22, 5, 2, P.teddyL);
      px(x + 11, yy + 22, 5, 2, P.teddyL);
      // 리본
      px(x + 8, yy + 9, 4, 2, P.retro);
      px(x + 7, yy + 9, 1, 2, P.retroD);
      px(x + 12, yy + 9, 1, 2, P.retroD);
      px(x + 9, yy + 9, 2, 1, '#E07A67');
    }

    function teddySmall(x, y, opts) {
      const { blink = false, hop = 0, closed = false } = opts || {};
      const yy = y - hop;
      G.fillStyle = 'rgba(27,17,11,0.22)';
      G.fillRect(x, yy + 15, 10, 1);
      // 귀
      px(x + 1, yy, 3, 3, P.teddy);
      px(x + 6, yy, 3, 3, P.teddy);
      px(x + 2, yy + 1, 1, 1, P.teddyL);
      px(x + 7, yy + 1, 1, 1, P.teddyL);
      // 머리
      px(x + 2, yy + 1, 6, 6, P.teddy);
      px(x + 3, yy + 4, 4, 3, P.teddyL);
      if (closed) {
        px(x + 3, yy + 3, 2, 1, P.ink);
        px(x + 6, yy + 3, 2, 1, P.ink);
      } else if (blink) {
        px(x + 3, yy + 3, 1, 1, P.ink);
        px(x + 6, yy + 3, 1, 1, P.ink);
      } else {
        px(x + 3, yy + 3, 1, 1, P.ink);
        px(x + 6, yy + 3, 1, 1, P.ink);
      }
      px(x + 4, yy + 5, 2, 1, P.ink);
      // 몸통
      px(x + 2, yy + 7, 6, 5, P.teddy);
      px(x + 3, yy + 8, 4, 3, P.teddyL);
      px(x, yy + 7, 2, 4, P.teddy);
      px(x + 8, yy + 7, 2, 4, P.teddy);
      px(x, yy + 10, 2, 1, P.teddyL);
      px(x + 8, yy + 10, 2, 1, P.teddyL);
      // 다리
      px(x + 2, yy + 12, 2, 3, P.teddy);
      px(x + 6, yy + 12, 2, 3, P.teddy);
      px(x + 2, yy + 14, 2, 1, P.teddyL);
      px(x + 6, yy + 14, 2, 1, P.teddyL);
      // 리본
      px(x + 4, yy + 7, 2, 1, P.retro);
    }

    /* ---------------- 동적: 캐릭터 ---------------- */
    function drawGirl(x, y, breath, blink, sway) {
      const yy = y - breath;
      G.fillStyle = 'rgba(27,17,11,0.28)';
      G.fillRect(x + 1, y + 26, 13, 2);
      // 다리
      px(x + 4, yy + 21, 2, 4, P.skinD);
      px(x + 8, yy + 21, 2, 4, P.skinD);
      // 신발
      px(x + 3, yy + 25, 3, 2, P.ink);
      px(x + 8, yy + 25, 3, 2, P.ink);
      // 스커트
      px(x + 1, yy + 18, 12, 4, P.retro);
      px(x + 2, yy + 18, 10, 1, '#E07A67');
      px(x + 1, yy + 21, 12, 1, P.retroD);
      // 상의 (레트로 카디건)
      px(x + 2, yy + 10, 10, 9, P.retro);
      px(x + 2, yy + 10, 10, 1, '#E07A67');
      px(x + 3, yy + 11, 8, 2, P.cream);
      px(x + 6, yy + 13, 2, 6, P.cream2);
      px(x + 3, yy + 15, 3, 1, '#B4553F');
      px(x + 8, yy + 15, 3, 1, '#B4553F');
      // 팔
      px(x, yy + 11, 2, 6, P.retro);
      px(x + 12, yy + 11, 2, 6, P.retro);
      px(x, yy + 16, 2, 2, P.skin);
      px(x + 12, yy + 16, 2, 2, P.skin);
      // 목
      px(x + 5, yy + 9, 4, 2, P.skinD);
      // 얼굴
      px(x + 2, yy + 2, 10, 8, P.skin);
      px(x + 2, yy + 2, 10, 1, '#F8E2C6');
      // 머리카락
      px(x + 1, yy, 12, 3, P.hair);
      px(x, yy + 1, 2, 8, P.hair);
      px(x + 12, yy + 1, 2, 8, P.hair);
      px(x + (sway ? 3 : 2), yy + 3, 2, 1, P.hair);
      px(x + (sway ? 8 : 9), yy + 3, 2, 1, P.hair);
      px(x + (sway ? 0 : 1), yy + 9, 2, 2, P.hair);
      px(x + (sway ? 12 : 11), yy + 9, 2, 2, P.hair);
      // 머리핀
      px(x + 10, yy + 1, 2, 1, P.brass);
      // 눈
      if (blink) {
        px(x + 4, yy + 5, 1, 1, P.ink);
        px(x + 9, yy + 5, 1, 1, P.ink);
      } else {
        px(x + 4, yy + 5, 1, 2, P.ink);
        px(x + 9, yy + 5, 1, 2, P.ink);
      }
      // 볼 · 입
      px(x + 3, yy + 7, 1, 1, '#E8A88F');
      px(x + 10, yy + 7, 1, 1, '#E8A88F');
      px(x + 6, yy + 8, 2, 1, '#C97A6B');
    }

    /* ---------------- 정적 장면 조립 ---------------- */
    function build() {
      G = b;
      b.clearRect(0, 0, W, H);
      drawWall();
      drawFloor();
      drawWindow();
      drawCalendar();
      drawCork();
      drawNook();
      drawShelf();
      drawRug();
      drawDesk();
      drawBasket();
      drawBeanbag();
      drawTV();
      drawPlant();
      drawDetails();
      G = ctx;
    }

    /* ---------------- 조명 ---------------- */
    function glow(cx, cy, r, rgb, alpha) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${rgb},${alpha})`);
      g.addColorStop(0.5, `rgba(${rgb},${alpha * 0.42})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    function vignette() {
      const g = ctx.createRadialGradient(80, 96, 30, 80, 96, 118);
      g.addColorStop(0, 'rgba(20,12,7,0)');
      g.addColorStop(0.72, 'rgba(20,12,7,0.10)');
      g.addColorStop(1, 'rgba(16,9,5,0.42)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    /* ---------------- 프레임 ---------------- */
    const hop = { chair: 0, shelf: 0, rug: 0 };
    const HOP_MS = 460;

    function bounce(start, now) {
      const p = Math.min(1, Math.max(0, (now - start) / HOP_MS));
      return p >= 1 ? 0 : Math.round(Math.sin(p * Math.PI) * 4);
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0);
      G = ctx;

      const t = now / 1000;

      // 조명
      const f = 0.92 + Math.sin(t * 2.3) * 0.06 + Math.sin(t * 6.1) * 0.02;
      glow(64, 72, 32, '217,167,96', 0.22 * f);
      glow(120, 139, 24, '217,167,96', 0.13 * f);
      glow(148, 62, 15, '232,196,140', 0.10 * f);
      glow(122, 26, 20, '190,208,236', 0.05);

      // 별 반짝임
      if (Math.floor(t * 1.4) % 3 === 0) px(20, 21, 1, 1, P.cream);
      if (Math.floor(t * 1.1) % 4 === 1) px(32, 23, 1, 1, P.brassL);
      if (Math.floor(t * 0.9) % 5 === 2) px(17, 29, 1, 1, P.cream);

      // TV 화면
      for (let yy = 131; yy < 145; yy++) {
        ctx.fillStyle = ['#C98F4A', '#D9A760', '#B87F3F'][(yy + Math.floor(t * 5)) % 3];
        ctx.globalAlpha = 0.7;
        ctx.fillRect(109, yy, 24, 1);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#4A3121';
      ctx.fillRect(109, 139, 24, 6);
      ctx.fillStyle = '#2B1D14';
      ctx.fillRect(109, 141, 24, 4);
      ctx.fillStyle = P.brassL;
      ctx.fillRect(124, 133, 3, 3);
      ctx.fillStyle = '#2B1D14';
      ctx.fillRect(126, 133, 1, 1);
      ctx.fillRect(109, 137, 24, 1);
      for (let yy = 131; yy < 145; yy += 2) {
        ctx.fillStyle = 'rgba(27,17,11,0.30)';
        ctx.fillRect(109, yy, 24, 1);
      }
      ctx.fillStyle = `rgba(244,233,216,${0.05 + Math.abs(Math.sin(t * 3.2)) * 0.04})`;
      ctx.fillRect(109, 131, 24, 14);

      // 머그 김
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.8 + i * 0.68) % 2;
        const sx = 50 + Math.sin((t + i) * 2.1) * 2;
        const sy = 76 - ph * 9;
        ctx.fillStyle = `rgba(244,233,216,${0.32 * (1 - ph / 2)})`;
        ctx.fillRect(Math.round(sx), Math.round(sy), 1, 2);
      }

      // 캐릭터
      const breath = Math.floor(t / 1.5) % 2;
      const blink = (t % 4.4) < 0.15;
      const sway = Math.floor(t / 0.6) % 2;
      drawGirl(55, 110, breath, blink, sway);

      // 곰인형들
      const bearBlink = (t % 5.2) < 0.13;
      const bob = Math.floor(t / 2.1) % 2;
      const hopChair = hop.chair ? bounce(hop.chair, now) : 0;
      const hopShelf = hop.shelf ? bounce(hop.shelf, now) : 0;
      const hopRug = hop.rug ? bounce(hop.rug, now) : 0;
      teddyBig(112, 90 + bob, { blink: bearBlink, hop: hopChair });
      teddySmall(147, 15 + bob, { blink: bearBlink, hop: hopShelf });
      teddySmall(83, 150, { closed: Math.floor(t / 3.4) % 4 !== 0, hop: hopRug });

      // 먼지 입자
      for (let i = 0; i < 8; i++) {
        const p = (t * (0.10 + i * 0.012) + i * 0.31) % 1;
        const x = 12 + ((i * 27) % 128) + Math.sin((t + i) * 0.8) * 3;
        const y = 70 + p * 96;
        ctx.fillStyle = `rgba(240,217,168,${0.18 * Math.sin(p * Math.PI)})`;
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }

      vignette();
    }

    let raf = null;
    let last = 0;
    let running = false;

    function loop(ts) {
      if (ts - last >= 70) {
        last = ts;
        frame(ts);
      }
      raf = requestAnimationFrame(loop);
    }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function start() {
      if (running) return;
      if (reduceMotion) {
        // 움직임 최소화 설정: 정지된 한 장면만 보여 줍니다
        frame(performance.now());
        return;
      }
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }

    function pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      // 마지막 프레임을 고정
      frame(performance.now());
    }

    function hopBear(name) {
      if (name in hop) hop[name] = performance.now();
      if (!running) start();
    }

    build();
    frame(performance.now());

    return { start, pause, hopBear };
  }

  window.WalnutRoom = { create };
})();
