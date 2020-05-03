import $ from "jquery";
$(document).ready(function() {
  $("#NSW").css("fill", "#34495E");
  $("#QLD").css("fill", "#3498DB");
  $("#NT").css("fill", "#EC7063");
  $("#WA").css("fill", "#E67E22");
  $("#VIC").css("fill", "#9B59B6");
  $("#TAS").css("fill", "#2ECC71");
  $("#SA").css("fill", "#F4D03F");

  $("#NSW").hover(
    function() {
      $("#NSW").css("fill", "#27394C");
    },
    function() {
      $("#NSW").css("fill", "#34495E");
    }
  );
  $("#NT").hover(
    function() {
      $("#NT").css("fill", "#E75D51");
    },
    function() {
      $("#NT").css("fill", "#EC7063");
    }
  );
  $("#QLD").hover(
    function() {
      $("#QLD").css("fill", "#2785D2");
    },
    function() {
      $("#QLD").css("fill", "#3498DB");
    }
  );
  $("#WA").hover(
    function() {
      $("#WA").css("fill", "#DF6B19");
    },
    function() {
      $("#WA").css("fill", "#E67E22");
    }
  );
  $("#VIC").hover(
    function() {
      $("#VIC").css("fill", "#8948A6");
    },
    function() {
      $("#VIC").css("fill", "#9B59B6");
    }
  );
  $("#TAS").hover(
    function() {
      $("#TAS").css("fill", "#23C05E");
    },
    function() {
      $("#TAS").css("fill", "#2ECC71");
    }
  );
  $("#SA").hover(
    function() {
      $("#SA").css("fill", "#F1C40F");
    },
    function() {
      $("#SA").css("fill", "#F4D03F");
    }
  );
});
