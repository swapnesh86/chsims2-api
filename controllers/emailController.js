const asyncHandler = require('express-async-handler')
const sendEmail = require("../utils/sendEmail");

const createNewEmail = asyncHandler(async (req, res) => {
    const { recipient, orderType, billno, customer, messagebody } = req.body

    const subject = `Thank you for your purchase (${orderType}) with Bill No.: ${billno}`
    const style = `<head><style>
		table {
			border: 1px solid black;
			font-size:12px;
			width:100%;
		}
    </style>
    </head>`
    const ch_header = `<thead className="table__row bill--searchrow">
                    <tr> <th colspan="2" style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">Creative Womens Empowerment Foundation</th> </tr>
                    <tr> 
                        <th style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">Bill No. </th>
                        <th style="border-bottom: solid 1px black;border-right: solid 1px black">${billno}</th> 
                    </tr>
                    <tr> 
                        <th style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">Customer </th> 
                        <th style="border-bottom: solid 1px black;border-right: solid 1px black">${customer}</th> 
                    </tr>
                </thead>`

    const head = `<thead className="table__row bill--searchrow">
                    <tr>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">SKU</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">Product</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">Qty</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">GST</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">MRP</th>
                    </tr>
                </thead>`
    let line = ''
    let gst_total = 0
    let mrp_total = 0
    for (let i = 0; i < messagebody.length; i++) {
        let cost = messagebody[i].mrp * messagebody[i].qty
        let gst_pct = messagebody[i].gst / 100
        let eff_gst = ((gst_pct * cost) / (1 + gst_pct)).toFixed(2)
        line = line + `<tr className="table__row bill--row" >
            <td style="border-right: solid 1px black">${messagebody[i].barcode}</td>
            <td style="border-right: solid 1px black">${messagebody[i].name}</td>
            <td style="text-align:center;border-right: solid 1px black">${messagebody[i].qty}</td>
            <td style="text-align:center;border-right: solid 1px black">${eff_gst}</td>
            <td style="text-align:center;border-right: solid 1px black">${cost}</td>
        </tr>`
        gst_total = gst_total + Number(eff_gst)
        mrp_total = mrp_total + Number(cost)
        //line = line + `<tr><td>${messagebody[i].barcode}</td><td>${messagebody[i].name}</td><td>${messagebody[i].mrp}</td><td>${messagebody[i].qty}</td></tr>`
    }
    gst_total = gst_total.toFixed(2)
    mrp_total = mrp_total.toFixed(2)
    const tail = `<thead className="table__row bill--searchrow">
                    <tr>
                        <th colspan="3" style="text-align:left;background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">Totals</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">${gst_total}</th>
                        <th style="background-color: darkblue;border-bottom: solid 1px black;border-right: solid 1px black">${mrp_total}</th>
                    </tr>
                </thead>`

    const ch_footer = `<thead className="table__row bill--searchrow">
                    <tr> 
                        <th style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">GST No. </th>
                        <th style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">27AAICC4194N1Z2</th>
                    </tr>
                    <tr><th colspan="2" style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">Please Note:</th> </tr>
                    <tr><th colspan="2" style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">All purchases are final and non-refundable.</th> </tr>
                    <tr><th colspan="2" style="text-align:left;border-bottom: solid 1px black;border-right: solid 1px black">Exchange is only allowed within 7 days.</th> </tr>
                </thead>`

    const message = `${style}<table>${ch_header}</table><table>${head}<tbody>${line}</tbody>${tail}</table>${ch_footer}`

    //Confirm Data
    if (!recipient || !subject || !message) {
        return res.status(400).json({ message: `Failed with messagebody: ${messagebody}` })
    }

    const sent_from = process.env.EMAIL_USER;
    const reply_to = recipient;
    //Create and store new email
    const email = await sendEmail(subject, message, recipient, sent_from, reply_to);

    if (email) {
        res.status(200).json({ success: true, message: `New email sent to ${recipient}` })
    } else {
        res.status(500).json({ message: 'Send Failed' })
    }

})

module.exports = {
    createNewEmail
}