var img = document.querySelector("div.transaction-image img");
var image_url = img.src;
var current_status = document.querySelector(
  "div.order div.order-actions-summary span.non-linked"
).innerText;
var order_no = document.querySelector(
  "div.order h2.section-title"
).innerText;
var shop_name = document.querySelector(
  "div.order span.shopname a"
).innerText;
var shop_url = document.querySelector("div.order span.shopname a").href;
var purchase_date = document.querySelector(
  "div.order span.second-line"
).innerText;
var orders_main = document.querySelector(
  "div.order div.order-details div.order-details-body div.order-details-body-transactions"
);
var orders = orders_main.getElementsByClassName("transaction");
var order_list = [];
for (var order of orders) {
  order_list.push({
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
var orders_summary = document.querySelector(
  "div.order div.order-details div.order-details-body div.order-details-body-summary div.order-details-body-summary-costs ul"
);
var summary = orders_summary.getElementsByClassName("clearfix");
var item_total;
var shop_discount;
var subtotal;
var order_total;
var shipping;
var sales_tax;
for (var li of summary) {
  switch (li.querySelector(".label")?.innerText?.trim()) {
    case "Item Total": {
      item_total = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Shop Discount": {
      shop_discount = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Shipping": {
      shipping = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Sales Tax": {
      sales_tax = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Subtotal": {
      subtotal = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    case "Order Total": {
      order_total = li.querySelector(
        ".value span.currency-value"
      )?.innerText;
      break;
    }
    default: {
    }
  }
}
var orders_payment = document.querySelector(
  "div.order div.order-details div.order-details-body div.order-details-body-summary div.order-details-body-summary-content div.payment-method"
);
var payment_method =
  orders_payment.querySelector("p.wt-break-all")?.innerText;
var payment_date = orders_payment.querySelector(
  "p.wt-text-caption.wt-text-gray"
)?.innerText;
if(!payment_method && !payment_date){
  var payment_method =
  orders_payment.querySelector("div.payment-type-credit-card");
  if(payment_method){
    payment_method = payment_method.querySelector("div.value")?.innerText;
    payment_date = orders_payment.querySelector(
      "div.details"
    )?.innerText;
  }
}
var payment_date_final;
if (payment_date) {
  payment_date = new Date(purchase_date.split("on ")[1]);
  var payment_day = String(payment_date.getDate()).padStart(2, "0");
  var payment_month = String(payment_date.getMonth() + 1).padStart(
    2,
    "0"
  );
  var payment_year = payment_date.getFullYear();
  payment_date_final =
    payment_day + "/" + payment_month + "/" + payment_year;
}
var date = new Date(purchase_date.split("on ")[1]);
var day = String(date.getDate()).padStart(2, "0");
var month = String(date.getMonth() + 1).padStart(2, "0");
var year = date.getFullYear();
var shipments = document.querySelector(
  "div.shipments div.shipment-details-body-map-addresses"
);
var res = {
  image_url: image_url,
  current_status: current_status,
  order_no: order_no.split("#")[1],
  shop_name: shop_name,
  shop_url: shop_url,
  purchase_date: day + "/" + month + "/" + year,
  order_list: order_list,
  item_total: item_total,
  shop_discount: shop_discount,
  subtotal: subtotal,
  order_total: order_total,
  sales_tax: sales_tax,
  shipping: shipping,
  payment_method: payment_method,
  payment_date: payment_date_final
};

if (shipments) {
  var from_locality = shipments
    .querySelector(
      "div.shipment-details-body-map-ship-from div.value div.locality"
    )
    ?.innerText?.trim();
  var address_to = {
    name: shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.name"
      )
      ?.innerText?.trim(),
    firstLine: shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.first-line"
      )
      ?.innerText?.trim(),
    city: shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.city"
      )
      ?.innerText?.trim(),
    zip: shipments
      .querySelector("div.shipment-details-body-map-ship-to div.value span.zip")
      ?.innerText?.trim(),
    state: shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.state"
      )
      ?.innerText?.trim(),
    country: shipments
      .querySelector(
        "div.shipment-details-body-map-ship-to div.value span.country-name"
      )
      ?.innerText?.trim(),
  };
  var delivery_notes = document
    .querySelector("div.shipment-details-body-carrier")
    ?.innerText?.trim();
  res = {
    ...res,
    address_from: from_locality,
    address_to: address_to,
    delivery_notes: delivery_notes,
  };
}

// Make a fetch request sending res as payload POST
fetch("http://127.0.0.1:5000/etsy", {
  method: "POST",
  body: JSON.stringify(res),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => alert(json));
