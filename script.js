let pj_img = document.querySelector("div.transaction-image img");
let pj_image_url = pj_img.src;
let pj_current_status = document.querySelector(
  "div.order div.order-actions-summary span.non-linked"
).innerText;
let pj_order_no = document.querySelector(
  "div.order h2.section-title"
).innerText;
let pj_shop_name = document.querySelector(
  "div.order span.shopname a"
).innerText;
let pj_shop_url = document.querySelector("div.order span.shopname a").href;
let pj_purchase_date = document.querySelector(
  "div.order span.second-line"
).innerText;
let pj_orders_main = document.querySelector(
  "div.order div.order-details div.order-details-body div.order-details-body-transactions"
);
let pj_orders = pj_orders_main.getElementsByClassName("transaction");
let pj_order_list = [];
for (let order of pj_orders) {
  pj_order_list.push({
    img_src: order.querySelector(
      "div.transaction-details-group div.transaction-image div.img-container a img"
    ).src,
    name: order.querySelector(
      "div.transaction-details-group div.transaction-summary div.transaction-title h3 a"
    ).innerText,
    transaction_num: order.querySelector(
      "div.transaction-details-group div.transaction-summary-details div.transaction-number"
    ).innerText.split("#")[1],
    quantity: order.querySelector(
      "div.transaction-details-group div.transaction-summary-details div.transaction-quantity"
    ).innerText.split(": ")[1],
    total: order.querySelector("div.transaction-cost span.currency-value")
      .innerText,
  });
}
const pj_date = new Date(pj_purchase_date.split("on ")[1]);
const pj_day = String(pj_date.getDate()).padStart(2, '0');
const pj_month = String(pj_date.getMonth() + 1).padStart(2, '0');
const pj_year = pj_date.getFullYear();
navigator.clipboard.writeText(
  JSON.stringify({
    image_url: pj_image_url,
    current_status: pj_current_status,
    order_no: pj_order_no.split("#")[1],
    shop_name: pj_shop_name,
    shop_url: pj_shop_url,
    purchase_date: pj_day + "/" + pj_month + "/" + pj_year,
    order_list: pj_order_list,
  })
);
