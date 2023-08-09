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
    transaction_num: order
      .querySelector(
        "div.transaction-details-group div.transaction-summary-details div.transaction-number"
      )
      .innerText.split("#")[1],
    quantity: order
      .querySelector(
        "div.transaction-details-group div.transaction-summary-details div.transaction-quantity"
      )
      .innerText.split(": ")[1],
    total: order.querySelector("div.transaction-cost span.currency-value")
      .innerText,
  });
}
let pj_orders_summary = document.querySelector(
  "div.order div.order-details div.order-details-body div.order-details-body-summary div.order-details-body-summary-costs ul"
);
let pj_summary = pj_orders_summary.getElementsByClassName("clearfix");
let pj_item_total;
let pj_shop_discount;
let pj_subtotal;
let pj_order_total;
for (let pj_li of pj_summary) {
  switch (pj_li.querySelector(".label")?.innerText?.trim()) {
    case "Item Total": {
      pj_item_total = pj_li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Shop Discount": {
      pj_shop_discount = pj_li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Subtotal": {
      pj_subtotal = pj_li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Order Total": {
      pj_order_total = pj_li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    default: {
    }
  }
}
const pj_date = new Date(pj_purchase_date.split("on ")[1]);
const pj_day = String(pj_date.getDate()).padStart(2, "0");
const pj_month = String(pj_date.getMonth() + 1).padStart(2, "0");
const pj_year = pj_date.getFullYear();
let pj_shipments = document.querySelector(
  "div.shipments div.shipment-details-body-map-addresses"
);
let res = {
  image_url: pj_image_url,
  current_status: pj_current_status,
  order_no: pj_order_no.split("#")[1],
  shop_name: pj_shop_name,
  shop_url: pj_shop_url,
  purchase_date: pj_day + "/" + pj_month + "/" + pj_year,
  order_list: pj_order_list,
  item_total: pj_item_total,
  shop_discount: pj_shop_discount,
  subtotal: pj_subtotal,
  order_total: pj_order_total,
  tax:
    pj_order_total && pj_subtotal
      ? (parseFloat(pj_order_total) - parseFloat(pj_subtotal)).toFixed(2)
      : undefined,
};

if (pj_shipments) {
  let pj_from_locality = pj_shipments
    .querySelector(
      "div.shipment-details-body-map-ship-from div.value div.locality"
    )
    ?.innerText?.trim();
  let pj_address_to = {
    name: pj_shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.name"
      )
      ?.innerText?.trim(),
    firstLine: pj_shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.first-line"
      )
      ?.innerText?.trim(),
    city: pj_shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.city"
      )
      ?.innerText?.trim(),
    zip: pj_shipments
      .querySelector("div.shipment-details-body-map-ship-to div.value span.zip")
      ?.innerText?.trim(),
    state: pj_shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.state"
      )
      ?.innerText?.trim(),
    country: pj_shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.country-name"
      )
      ?.innerText?.trim(),
  };
  let pj_delivery_notes = document
    .querySelector("div.shipment-details-body-carrier")
    ?.innerText?.trim();
  res = {
    ...res,
    address_from: pj_from_locality,
    address_to: pj_address_to,
    delivery_notes: pj_delivery_notes,
  };
}

navigator.clipboard.writeText(JSON.stringify(res));
