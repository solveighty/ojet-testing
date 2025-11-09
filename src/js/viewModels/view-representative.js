// 🎯 VIEW REPRESENTATIVE - ViewModel para mostrar información del representante
// ==================================================================================

define(['ojs/ojcore',
  'knockout',
  'jquery'],
  function (oj, ko, $) {

    function RepresentativeViewModel(params) {
      var self = this;

      console.log("🎯 RepresentativeViewModel CREATED - params:", params);
      console.log("🎯 params.repId:", params.repId);

      // 🔹 VARIABLES - Variables de información del representante
      self.name = ko.observable();
      self.role = ko.observable();
      self.bio = ko.observable();
      self.ratingValue = ko.observable();

      // 🔹 REP ID - Observable para el ID del representante
      self.repId = ko.computed(function () {
        var id = params.repId();  // ← Llamar como función para obtener el valor
        console.log("🎯 repId computed - returning:", id, "type:", typeof id);
        return id;
      });

      // 🔹 FETCH REPRESENTATIVE - Cargar datos del representante cuando repId tiene valor
      // Llamar fetch inmediatamente si ya hay un repId
      var loadRepresentative = function() {
        var repId = self.repId();
        console.log("🎯 loadRepresentative called - repId:", repId, "type:", typeof repId);
        
        if (repId) {
          console.log("🎯 Making AJAX call to: http://localhost:8085/representative-information/" + repId);
          $.ajax({
            type: "GET",
            url: "http://localhost:8085/representative-information/" + repId,
            crossDomain: true,
            success: function (res) {
              console.log("✅ Representative data LOADED:", res);
              self.name(res.name);
              self.role(res.role);
              self.bio(res.bio);
              self.ratingValue(res.ratingValue);
              console.log("✅ Representative data SET - name:", self.name());
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error("❌ AJAX ERROR:", textStatus, errorThrown, jqXHR);
            }
          });
        } else {
          console.log("⚠️  repId is empty/null");
        }
      };

      // Subscribe para cambios futuros
      self.repId.subscribe(loadRepresentative);
      
      // Y también llamar inmediatamente por si ya hay un valor
      loadRepresentative();
    }

    return RepresentativeViewModel;
  }
);
