$(function() {
  $(document).ready(() => {
    if ($(window).width() <= 1199) {
      window.location.href = "/admin/phone";
    }
  });

  $("#dev-table-filter").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $("#q-table tr").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
  $("#up_form").on("submit", function(e) {
    if (
      $("#titleForm").val() == "" ||
      $("#linkForm").val() == "" ||
      $("#tagForm").val() == "" ||
      $("#defForm").val() == "" ||
      $("#imageForm").val() == ""
    ) {
      e.preventDefault();
    } else {
      $("#add_fr").append(`<div
      class="alert alert-success alert-dismissible fade show text-center"
      role="alert"
    >
      <div class="spinner-border" role="status" style="margin-left: 50px;">
        <span class="sr-only">Loading...</span>
      </div>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`);
    }
  });
  $("#dl_form").on("submit", function(e) {
    if ($("#deleteTagForm").val() == "") {
      e.preventDefault();
    }
  });
});
