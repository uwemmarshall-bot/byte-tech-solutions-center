//==================================================
// Lesson Payment Management System
// Shared Receipt Printing Module
//==================================================

export const INSTITUTE_NAME = "Byte Tech Solutions";
export const INSTITUTE_TAGLINE = "Center for CBT Assessment & ICT Training with Certificates";

function money(value) {
    return "₦" + Number(value || 0).toLocaleString();
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

//==================================================
// BUILD + OPEN A PRINTABLE RECEIPT FOR A STUDENT
//==================================================

export function printStudentReceipt(student, teacherName) {
    if (!student) return;

    const share = Number(student.amountPaid || 0) / 3;
    const issued = new Date().toLocaleDateString();
    const receiptNo = "BTS-" + String(student.createdAt || Date.now()).slice(-6);
    const durationLabel = student.durationMonths
        ? student.durationMonths + " Month" + (Number(student.durationMonths) === 1 ? "" : "s")
        : "-";

    // Resolve the logo relative to the page that opened this receipt,
    // since the pop-up window itself starts at "about:blank".
    const baseHref = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);
    const logoSrc = baseHref + "logo.jpg";

    // Monogram used in the seal badge — first letters of each word in the
    // institute name (e.g. "Byte Tech Solutions" -> "BTS").
    const monogram = INSTITUTE_NAME.split(" ").map((w) => w[0]).join("").slice(0, 3);

    const infoRows = [
        ["Student Name", escapeHtml(student.name)],
        ["Sex", escapeHtml(student.sex) || "-"],
        ["Email", escapeHtml(student.email) || "-"],
        ["Address", escapeHtml(student.address) || "-"],
        ["Program", escapeHtml(student.program) || "-"],
        ["Duration", escapeHtml(durationLabel)],
        ["Assigned Teacher", escapeHtml(teacherName) || "-"],
        ["Start Date", student.startDate || "-"],
        ["Stop Date", student.stopDate || "-"]
    ];

    const infoGridHtml = infoRows.map(([label, value]) => `
        <div class="info-cell">
            <span class="info-label">${label}</span>
            <span class="info-value">${value}</span>
        </div>`).join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<base href="${baseHref}">
<title>Receipt - ${escapeHtml(student.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
    :root{
        --ink:#1c2b22;
        --forest:#1d4433;
        --forest-mid:#2f5d46;
        --gold:#b8862c;
        --gold-soft:#e4c274;
        --cream:#f3ead9;
        --paper:#fffcf5;
        --muted:#7c8577;
        --hairline:#e2d6b8;
    }
    *{ box-sizing:border-box; }
    body{
        font-family:'Inter', Arial, sans-serif;
        margin:0;
        padding:48px 20px;
        color:var(--ink);
        background:var(--cream);
        -webkit-font-smoothing:antialiased;
    }
    .receipt-box{
        position:relative;
        max-width:640px;
        margin:auto;
        background:var(--paper);
        border:1px solid var(--hairline);
        border-radius:4px;
        padding:0;
        overflow:hidden;
        box-shadow:0 1px 2px rgba(28,43,34,.04), 0 18px 40px -22px rgba(28,43,34,.25);
    }
    .receipt-box::before{
        content:"";
        position:absolute;
        inset:10px;
        border:1px solid var(--gold-soft);
        border-radius:2px;
        pointer-events:none;
    }
    .watermark{
        position:absolute;
        top:52%;
        left:50%;
        transform:translate(-50%,-50%) rotate(-18deg);
        font-family:'Fraunces', Georgia, serif;
        font-size:92px;
        font-weight:700;
        color:var(--forest);
        opacity:.05;
        letter-spacing:.05em;
        white-space:nowrap;
        pointer-events:none;
        z-index:0;
    }
    .content{ position:relative; z-index:1; padding:38px 40px 34px; }
    .letterhead{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:16px;
        padding-bottom:22px;
        border-bottom:2px solid var(--forest);
    }
    .brand{ display:flex; align-items:center; gap:14px; }
    .receipt-logo{
        width:52px;
        height:52px;
        object-fit:contain;
        border-radius:50%;
        background:#fff;
        box-shadow:0 0 0 3px var(--paper), 0 0 0 4px var(--gold);
        flex-shrink:0;
    }
    .brand-name{
        font-family:'Fraunces', Georgia, serif;
        font-weight:600;
        font-size:21px;
        color:var(--forest);
        line-height:1.15;
    }
    .brand-tagline{
        margin-top:3px;
        font-size:10.5px;
        color:var(--muted);
        text-transform:uppercase;
        letter-spacing:.08em;
        font-weight:600;
    }
    .doc-meta{ text-align:right; }
    .doc-eyebrow{
        font-size:10.5px;
        font-weight:700;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:var(--gold);
    }
    .doc-title{
        font-family:'Fraunces', Georgia, serif;
        font-size:19px;
        font-weight:600;
        color:var(--ink);
        margin-top:2px;
    }
    .doc-sub{
        margin-top:8px;
        font-size:11.5px;
        color:var(--muted);
        line-height:1.6;
    }
    .doc-sub b{ color:var(--ink); font-weight:600; }
    .info-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:0;
        margin-top:26px;
        border:1px solid var(--hairline);
        border-radius:3px;
        overflow:hidden;
    }
    .info-cell{
        padding:12px 18px;
        border-bottom:1px solid var(--hairline);
        border-right:1px solid var(--hairline);
        display:flex;
        flex-direction:column;
        gap:3px;
    }
    .info-cell:nth-child(2n){ border-right:none; }
    .info-label{
        font-size:10px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:var(--muted);
    }
    .info-value{ font-size:13.5px; color:var(--ink); font-weight:500; }
    .amount-panel{
        position:relative;
        margin-top:22px;
        background:var(--forest);
        border-radius:4px;
        padding:20px 24px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:16px;
        flex-wrap:wrap;
    }
    .amount-label{
        font-size:10.5px;
        font-weight:700;
        letter-spacing:.12em;
        text-transform:uppercase;
        color:var(--gold-soft);
    }
    .amount-figure{
        font-family:'Fraunces', Georgia, serif;
        font-size:30px;
        font-weight:600;
        color:#fdf8ec;
        margin-top:2px;
    }
    .seal{
        width:58px;
        height:58px;
        border-radius:50%;
        border:2px solid var(--gold-soft);
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:'Fraunces', Georgia, serif;
        font-weight:700;
        font-size:15px;
        letter-spacing:.04em;
        color:var(--gold-soft);
        flex-shrink:0;
        position:relative;
    }
    .seal::after{
        content:"";
        position:absolute;
        inset:5px;
        border:1px dashed rgba(228,194,116,.55);
        border-radius:50%;
    }
    .description-note{
        margin-top:18px;
        padding:12px 16px;
        background:var(--cream);
        border-left:3px solid var(--gold);
        border-radius:2px;
        font-size:12.5px;
        color:var(--ink);
        line-height:1.55;
    }
    .description-note .info-label{ margin-bottom:4px; display:block; }
    .signature-row{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:24px;
        margin-top:40px;
        flex-wrap:wrap;
    }
    .signature-line{
        flex:1;
        min-width:180px;
        border-top:1px solid var(--ink);
        padding-top:6px;
        font-size:10.5px;
        color:var(--muted);
        text-transform:uppercase;
        letter-spacing:.06em;
        font-weight:600;
    }
    .footer-note{
        margin-top:26px;
        padding-top:16px;
        border-top:1px dashed var(--hairline);
        font-size:10.5px;
        color:var(--muted);
        text-align:center;
        line-height:1.6;
    }
    .print-btn{
        display:block;
        margin:26px auto 0;
        padding:11px 26px;
        background:var(--forest);
        color:#fdf8ec;
        border:none;
        border-radius:6px;
        font-weight:700;
        font-size:13px;
        letter-spacing:.02em;
        cursor:pointer;
    }
    .print-btn:hover{ background:var(--forest-mid); }
    @media print{
        body{ background:#fff; padding:0; }
        .receipt-box{ box-shadow:none; border:none; }
        .no-print{ display:none; }
    }
</style>
</head>
<body>
<div class="receipt-box">
    <div class="watermark">${escapeHtml(monogram)}</div>
    <div class="content">
        <div class="letterhead">
            <div class="brand">
                <img class="receipt-logo" src="${logoSrc}" alt="${escapeHtml(INSTITUTE_NAME)}" onerror="this.style.display='none'">
                <div>
                    <div class="brand-name">${escapeHtml(INSTITUTE_NAME)}</div>
                    <div class="brand-tagline">${escapeHtml(INSTITUTE_TAGLINE)}</div>
                </div>
            </div>
            <div class="doc-meta">
                <div class="doc-eyebrow">Official Receipt</div>
                <div class="doc-title">No. ${escapeHtml(receiptNo)}</div>
                <div class="doc-sub">Date Issued<br><b>${escapeHtml(issued)}</b></div>
            </div>
        </div>

        <div class="info-grid">${infoGridHtml}</div>

        <div class="amount-panel">
            <div>
                <div class="amount-label">Amount Paid</div>
                <div class="amount-figure">${money(student.amountPaid)}</div>
            </div>
            <div class="seal">${escapeHtml(monogram)}</div>
        </div>

        ${student.description ? `
        <div class="description-note">
            <span class="info-label">Description</span>
            ${escapeHtml(student.description)}
        </div>` : ""}

        <div class="signature-row">
            <div class="signature-line">Authorized Signature</div>
            <div class="signature-line" style="text-align:right;">Institute Stamp</div>
        </div>

        <div class="footer-note">
            This receipt is computer generated and confirms the payment record on file
            for the above student at ${escapeHtml(INSTITUTE_NAME)}.
        </div>

        <button class="print-btn no-print" onclick="window.print()">Print Receipt</button>
    </div>
</div>
<script>
    window.onload = function(){ window.print(); };
</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=650,height=750");
    if (!win) {
        alert("Please allow pop-ups to print the receipt.");
        return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
}
