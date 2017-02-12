import uv from "uvCharts";

Template.totalProductsSold.onRendered(() => {
  let toDate;

  const fromDate = $("#fromDate")
    .datepicker({
      maxDate: "+1M +10D",
      changeMonth: true,
      changeYear: true
    })
    .on("change", function () {
      toDate.datepicker("option", "minDate", getDate(this));
      Session.set("fromDate", this.value);
      return this.value;
    });
  toDate = $("#toDate").datepicker({
    changeMonth: true,
    changeYear: true
  })
    .on("change", function () {
     // fromDate.datepicker("option", "minDate", getDate(this));
      Session.set("toDate", this.value);
      return this.value;
    });

  function getDate(element) {
    let date;
    try {
      date = $.datepicker.parseDate("mm/dd/yy", element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }
});

const getChart = (data) => {
  const graphDef = {
    categories: ["uvCharts"],
    dataset: {
      uvCharts: data
    }
  };

  const chartObject = uv.chart("Bar", graphDef, {
    graph: {
      orientation: "Vertical",
      custompalette: ["#A1A4A5", "#C80F98", "#5F0DCF"]
    },
    meta: {
      position: "#sell",
      caption: "Usage over years",
      subcaption: "among Imaginea OS products",
      hlabel: "Years",
      vlabel: "Number of users",
      vsublabel: "in thousands"
    },
    dimension: {
      width: "800",
      height: "500"
    }
  });
};

Template.totalProductsSold.helpers({
  getSelectedDates() {
    console.log(Session.get("fromDate"));
  },
  runChart() {
  }
});


Template.totalProductsSold.events({
  "click .btn": () => {
    fD = Session.get("fromDate");
    tD =  Session.get("toDate");
    Meteor.call("analytics/getOrders");
    Meteor.call("analytics/getProductSales", fD, tD, (error, result) => {
      console.log("Returned Result", result);
      getChart(result);
    });
  }
});
