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



    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<base href="${baseHref}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Payment Receipt - ${escapeHtml(student.name)}</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

:root{

    --primary:#0f6b45;
    --primary-dark:#09492f;
    --secondary:#d4af37;
    --light:#f5f7fa;
    --border:#dfe5ea;
    --text:#333;
    --muted:#777;
    --success:#28a745;
}

body{

    background:#edf2f7;
    font-family:'Inter',sans-serif;
    color:var(--text);
    padding:40px;
}

/*************************************************
A4 RECEIPT
*************************************************/

.receipt-box{

    width:210mm;
    min-height:297mm;

    max-width:820px;

    margin:auto;

    background:#fff;

    border-radius:16px;

    overflow:hidden;

    box-shadow:
        0 15px 40px rgba(0,0,0,.12);

    position:relative;
}

/*************************************************
WATERMARK
*************************************************/

.receipt-box::after{

    content:"PAID";

    position:absolute;

    left:50%;

    top:48%;

    transform:translate(-50%,-50%) rotate(-32deg);

    font-size:145px;

    font-weight:900;

    letter-spacing:18px;

    color:rgba(15,107,69,.04);

    pointer-events:none;

    user-select:none;

}

/*************************************************
HEADER
*************************************************/

.receipt-head{

    background:linear-gradient(135deg,
            #0f6b45 0%,
            #14754b 60%,
            #0b5034 100%);

    color:#fff;

    padding:40px;

    text-align:center;

    position:relative;

}

.receipt-head::before{

    content:"";

    position:absolute;

    inset:0;

    background:
    radial-gradient(circle at top right,
    rgba(255,255,255,.18),
    transparent 45%);

}

.receipt-logo{

    width:90px;

    height:90px;

    object-fit:contain;

    border-radius:50%;

    background:#fff;

    padding:8px;

    border:4px solid rgba(255,255,255,.25);

    margin-bottom:15px;

    position:relative;

    z-index:2;

}

.receipt-head h1{

    position:relative;

    z-index:2;

    font-size:31px;

    font-weight:800;

    margin-bottom:6px;

    letter-spacing:.5px;

}

.tagline{

    position:relative;

    z-index:2;

    font-size:13px;

    letter-spacing:2px;

    text-transform:uppercase;

    opacity:.95;

}

/*************************************************
STATUS BADGE
*************************************************/

.status{

    display:inline-block;

    margin-top:18px;

    padding:9px 24px;

    border-radius:40px;

    background:#fff;

    color:var(--primary);

    font-weight:800;

    font-size:13px;

    letter-spacing:1px;

    box-shadow:0 5px 15px rgba(0,0,0,.15);

    position:relative;

    z-index:2;

}

/*************************************************
META BAR
*************************************************/

.meta-row{

    display:flex;

    justify-content:space-between;

    flex-wrap:wrap;

    gap:15px;

    padding:20px 35px;

    background:#f8fafb;

    border-bottom:3px solid #edf2f5;

}

.meta-card{

    flex:1;

    min-width:180px;

}

.meta-title{

    font-size:11px;

    text-transform:uppercase;

    color:#999;

    margin-bottom:5px;

    letter-spacing:1px;

}

.meta-value{

    font-size:15px;

    font-weight:700;

    color:#222;

}

/*************************************************
SECTION TITLE
*************************************************/

.section-title{

    margin:30px 35px 20px;

    font-size:18px;

    font-weight:700;

    color:var(--primary);

    display:flex;

    align-items:center;

    gap:10px;

}

.section-title::before{

    content:"";

    width:5px;

    height:24px;

    background:var(--secondary);

    border-radius:4px;

}

/*************************************************
TABLE
*************************************************/

table{

    width:calc(100% - 70px);

    margin:0 35px 30px;

    border-collapse:separate;

    border-spacing:0 10px;

}

table tr{

    background:#fafbfc;

    border-radius:8px;

}

table td{

    padding:15px 18px;

    font-size:14px;

}

.label{

    width:38%;

    background:#f3f6f8;

    color:var(--primary);

    font-weight:700;

    text-transform:uppercase;

    font-size:12px;

    letter-spacing:.8px;

    border-left:5px solid var(--secondary);

}

/*************************************************
AMOUNT
*************************************************/

.amount{

    font-size:28px;

    font-weight:800;

    color:var(--success);

}

/*************************************************
TOTAL
*************************************************/

.total-row td{

    background:linear-gradient(135deg,
        var(--primary),
        var(--primary-dark));

    color:#fff;

    font-size:18px;

    font-weight:800;

}

/*************************************************
SIGNATURE
*************************************************/

.signature{

    display:flex;

    justify-content:space-between;

    gap:40px;

    margin:50px 35px 25px;

}

.sign-box{

    flex:1;

    text-align:center;

}

.sign-line{

    border-top:2px solid #444;

    margin-bottom:10px;

}

.sign-title{

    font-size:13px;

    color:#666;

    font-weight:600;

}

/*************************************************
FOOTER
*************************************************/

.footer-note{

    margin:30px 35px;

    padding-top:20px;

    border-top:1px solid #ddd;

    text-align:center;

    color:#777;

    font-size:12px;

    line-height:1.8;

}

/*************************************************
BUTTON
*************************************************/

.print-btn{

    display:block;

    margin:0 auto 35px;

    background:linear-gradient(135deg,
        var(--primary),
        var(--primary-dark));

    color:#fff;

    border:none;

    padding:15px 35px;

    border-radius:8px;

    cursor:pointer;

    font-size:15px;

    font-weight:700;

    transition:.3s;

}

.print-btn:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(0,0,0,.15);

}

/*************************************************
PRINT
*************************************************/

@page{

    size:A4;

    margin:8mm;

}

@media print{

body{

background:#fff;

padding:0;

}

.receipt-box{

width:100%;

box-shadow:none;

border-radius:0;

}

.print-btn{

display:none;

}

}

</style>

</head>

<body>

<div class="receipt-box">

<div class="receipt-head">

<img
class="receipt-logo"
src="${logoSrc}"
alt="${escapeHtml(INSTITUTE_NAME)}"
onerror="this.style.display='none'">

<h1>${escapeHtml(INSTITUTE_NAME)}</h1>

<div class="tagline">

${escapeHtml(INSTITUTE_TAGLINE)}

</div>

<div class="status">

PAYMENT RECEIVED

</div>

</div>

<div class="meta-row">

<div class="meta-card">

<div class="meta-title">

Receipt Number

</div>

<div class="meta-value">

${escapeHtml(receiptNo)}

</div>

</div>

<div class="meta-card">

<div class="meta-title">

Date Issued

</div>

<div class="meta-value">

${escapeHtml(issued)}

</div>

</div>

</div>

<div class="section-title">

Student Information

</div>

<table>
<tr>
    <td class="label">Student Name</td>
    <td>
        <strong style="font-size:16px;color:#222;">
            ${escapeHtml(student.name)}
        </strong>
    </td>
</tr>

<tr>
    <td class="label">Gender</td>
    <td>
        ${escapeHtml(student.sex) || "-"}
    </td>
</tr>

<tr>
    <td class="label">Email Address</td>
    <td>
        ${escapeHtml(student.email) || "-"}
    </td>
</tr>

<tr>
    <td class="label">Residential Address</td>
    <td>
        ${escapeHtml(student.address) || "-"}
    </td>
</tr>

<tr>
    <td class="label">Programme</td>
    <td>
        ${escapeHtml(student.program) || "-"}
    </td>
</tr>

<tr>
    <td class="label">Course Duration</td>
    <td>
        ${escapeHtml(durationLabel)}
    </td>
</tr>

<tr>
    <td class="label">Assigned Teacher</td>
    <td>
        ${escapeHtml(teacherName) || "-"}
    </td>
</tr>

<tr>
    <td class="label">Start Date</td>
    <td>
        ${student.startDate || "-"}
    </td>
</tr>

<tr>
    <td class="label">Completion Date</td>
    <td>
        ${student.stopDate || "-"}
    </td>
</tr>

<tr>
    <td class="label">Payment Description</td>
    <td>
        ${escapeHtml(student.description) || "-"}
    </td>
</tr>

<tr class="total-row">
    <td>Total Amount Paid</td>
    <td class="amount">
        ${money(student.amountPaid)}
    </td>
</tr>

</table>

<div style="
    margin:0 35px;
    padding:22px;
    border-radius:12px;
    background:#f8fbf8;
    border-left:6px solid #0f6b45;
">

    <div style="
        font-size:13px;
        color:#666;
        text-transform:uppercase;
        letter-spacing:1px;
        margin-bottom:8px;
        font-weight:700;
    ">
        Payment Status
    </div>

    <div style="
        display:flex;
        align-items:center;
        gap:12px;
    ">

        <span style="
            width:16px;
            height:16px;
            border-radius:50%;
            background:#28a745;
            display:inline-block;
            box-shadow:0 0 10px rgba(40,167,69,.45);
        ">
        </span>

        <span style="
            font-size:18px;
            font-weight:800;
            color:#0f6b45;
        ">
            SUCCESSFULLY PAID
        </span>

    </div>

</div>

<div style="
    display:flex;
    justify-content:space-between;
    margin:35px;
    gap:20px;
">

    <div style="
        flex:1;
        background:#fafafa;
        border:1px solid #e6e6e6;
        border-radius:10px;
        padding:20px;
    ">

        <div style="
            color:#999;
            text-transform:uppercase;
            font-size:11px;
            letter-spacing:1px;
            margin-bottom:10px;
            font-weight:700;
        ">
            Receipt Information
        </div>

        <div style="line-height:2;color:#444;font-size:14px;">

            <strong>Receipt No:</strong><br>
            ${escapeHtml(receiptNo)}

            <br><br>

            <strong>Date Issued:</strong><br>
            ${escapeHtml(issued)}

        </div>

    </div>

    <div style="
        flex:1;
        background:#fafafa;
        border:1px solid #e6e6e6;
        border-radius:10px;
        padding:20px;
    ">

        <div style="
            color:#999;
            text-transform:uppercase;
            font-size:11px;
            letter-spacing:1px;
            margin-bottom:10px;
            font-weight:700;
        ">
            Payment Summary
        </div>

        <div style="
            color:#444;
            line-height:2;
            font-size:14px;
        ">

            <strong>Programme</strong><br>

            ${escapeHtml(student.program) || "-"}

            <br><br>

            <strong>Duration</strong><br>

            ${escapeHtml(durationLabel)}

        </div>

    </div>

</div>
<!-- Verification & Signature Section -->

<div style="
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:40px;
    margin:50px 35px 25px;
">

    <!-- QR Placeholder -->
    <div style="text-align:center;">

        <div style="
            width:110px;
            height:110px;
            border:2px dashed #0f6b45;
            border-radius:8px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#888;
            font-size:11px;
            font-weight:600;
            background:#fafafa;
        ">
            QR CODE
        </div>

        <div style="
            margin-top:10px;
            font-size:11px;
            color:#666;
        ">
            Verification Code
        </div>

    </div>

    <!-- Authorized Signature -->
    <div style="
        flex:1;
        text-align:right;
    ">

        <div style="
            height:60px;
            display:flex;
            align-items:flex-end;
            justify-content:flex-end;
        ">

            <span style="
                font-size:32px;
                font-family:cursive;
                color:#0f6b45;
            ">
                __________________
            </span>

        </div>

        <div style="
            border-top:2px solid #444;
            margin-top:10px;
            padding-top:8px;
            display:inline-block;
            min-width:220px;
            text-align:center;
            font-size:13px;
            font-weight:700;
            color:#555;
        ">
            Authorized Signature
        </div>

    </div>

</div>

<!-- Security Notice -->

<div style="
    margin:0 35px;
    background:#fff8e6;
    border-left:5px solid #d4af37;
    padding:18px;
    border-radius:8px;
">

    <div style="
        font-weight:700;
        color:#8a6d00;
        margin-bottom:8px;
        font-size:14px;
    ">
        SECURITY NOTICE
    </div>

    <div style="
        font-size:13px;
        color:#666;
        line-height:1.8;
    ">

        This receipt is electronically generated by
        <strong>${escapeHtml(INSTITUTE_NAME)}</strong>.

        Any alteration, duplication, or unauthorized modification
        renders this receipt invalid.

        Please keep this receipt for future reference.

    </div>

</div>

<!-- Footer -->

<div class="footer-note">

    <div style="
        font-size:15px;
        font-weight:700;
        color:#0f6b45;
        margin-bottom:8px;
    ">

        Thank You For Your Payment

    </div>

    <div>

        This receipt confirms that payment has been received and
        recorded successfully in the official payment records of

        <strong>${escapeHtml(INSTITUTE_NAME)}</strong>.

    </div>

    <div style="margin-top:18px;">

        © ${new Date().getFullYear()}
        ${escapeHtml(INSTITUTE_NAME)}.
        All Rights Reserved.

    </div>

</div>

<button
class="print-btn no-print"
onclick="window.print()">

Print Receipt

</button>

</div>

<script>

window.onload = function(){

    setTimeout(function(){

        window.print();

    },500);

};

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
}`;

    const win = window.open("", "_blank", "width=650,height=750");
    if (!win) {
        alert("Please allow pop-ups to print the receipt.");
        return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
}
