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

const getBarChart = (data) => {
  const graphDef = {
    categories: ["sales"],
    dataset: {
      sales: data
    }
  };

  uv.chart("Bar", graphDef, {
    graph: {
      orientation: "Vertical",
      custompalette: ["#C80F98"]
    },
    meta: {
      position: "#salesChart",
      caption: "Total product sales",
      subcaption: "within the selected dates",
      hlabel: "Years",
      vlabel: "Number of products sold",
      vsublabel: "within the selected dates"
    },
    dimension: {
      width: "500",
      height: "500"
    },
    caption: {
      fontsize: "20"
    },
    subcaption: {
      fontsize: "50"
    },
    axis: {
      subticks: 0,
      ticks: 3
    },
    margin: {
      top: 100
    },
    legend: {
      position: "right",
      legendstart: 0,
      fontfamily: "Arial",
      fontsize: "11",
      fontweight: "normal",
      legendtype: "dataset",
      symbolsize: 10,
      showlegends: true
    },
    effects: {
      hovercolor: "#FF0000",
      strokecolor: "none",
      textcolor: "#000000",
      duration: 800,
      hover: 400,
      showhovertext: true
    }
  });
};

Template.totalProductsSold.events({
  "click .btn": () => {
    fD = Session.get("fromDate");
    tD = Session.get("toDate");
    $("#salesChart .uv-chart-div").remove();
    Meteor.call("analytics/getProductSales", fD, tD, (error, result) => {
      $("#valid").append("<h1> No data avaliable!! </h1>");
      if (result.length === 0) {
        $("#valid").show();
      } else {
        $("#valid").hide();
        getBarChart(result);
      }
    });
  }
});
