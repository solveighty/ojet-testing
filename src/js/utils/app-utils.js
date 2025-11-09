// 🎨 APP UTILS - Utilidades compartidas de la aplicación
// =======================================================

define(['knockout'],
  function (ko) {
    function appUtils() {
      var self = this;

      // 🔹 UTILS - Utilidades compartidas

      // 🔹 FORMAT DATE - Formatear fecha en formato dd/MM/yyyy
      self.formatDate = function (date) {
        if (!date) {
          return '';
        }

        try {
          var dateObj = new Date(date);
          var day = String(dateObj.getDate()).padStart(2, '0');
          var month = String(dateObj.getMonth() + 1).padStart(2, '0');
          var year = dateObj.getFullYear();
          return day + '/' + month + '/' + year;
        } catch (e) {
          console.error('Error formatting date:', e);
          return date;
        }
      }

      return self;
    }

    return new appUtils();
  }
)
