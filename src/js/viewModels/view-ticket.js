// 🎯 VIEW TICKET - ViewModel para ver detalles del ticket
// ==========================================================

define(['ojs/ojcore',
  'knockout',
  'jquery',
  'utils/app-utils',
  'ojs/ojlistview',
  'ojs/ojarraydataprovider',
  'trumbowyg',
],
  function (oj, ko, $, appUtils) {

    function ViewTicketViewModel(params) {
      var self = this;

      console.log("📌 ViewTicketViewModel CREATED - params:", params);

      // 🔹 INITIALIZE - Se ejecuta cuando el ViewModel es creado
      this.initialize = function(params) {
        console.log("📌 ViewTicketViewModel.initialize() called - params:", params);
      };

      // 🔹 DISPOSE - Se ejecuta cuando el módulo se destruye
      this.dispose = function() {
        console.log("📌 ViewTicketViewModel.dispose() called");
      };

      // 🔹 VARIABLES - Variables de visualización del ticket
      self.ticketId = ko.observable();
      self.title = ko.observable();
      self.author = ko.observable();
      self.dateCreated = ko.observable();
      self.showDateDifference = ko.observable();
      self.message = ko.observable();
      self.status = ko.observable();
      self.attachment = ko.observable();

      // 🔹 TICKET REPLIES - Colección y DataSource para replies
      self.ticketRepliesDataSource = ko.observable();
      self.ticketRepliesArray = ko.observableArray([]);
      
      // Crear ArrayDataProvider para las replies
      var ticketRepliesProvider = new oj.ArrayDataProvider(self.ticketRepliesArray, {
        keyAttributes: 'id'
      });
      self.ticketRepliesDataSource(ticketRepliesProvider);

      // 🔹 FORMAT DATE - Utilidad para formatear fecha
      self.formatDate = appUtils.formatDate;

      // 🔹 UPDATE TICKET DATA - Función auxiliar para actualizar los datos del ticket
      var updateTicketData = function(ticket) {
        if (ticket) {
          console.log("📌 Updating ticket data with:", ticket);
          self.ticketId(ticket.id);
          self.title(ticket.title);
          self.author(ticket.author);
          self.dateCreated(ticket.dateCreated);
          self.message(ticket.message);
          self.status(ticket.status);
          self.attachment(ticket.attachment);
          console.log("📌 Ticket data updated - title:", self.title());
        }
      };

      // 🔹 TICKET MODEL - Computed para escuchar cambios de ticket
      self.ticketModel = ko.computed(function () {
        if (!params || !params.ticketModel) {
          console.log("📌 params or ticketModel not available");
          return null;
        }
        var ticket = params.ticketModel();
        console.log("📌 Ticket model changed:", ticket);
        updateTicketData(ticket);
        return ticket;
      });

      // 🔹 FETCH REPLIES - Suscribirse a cambios de ticketId para cargar replies
      self.ticketId.subscribe(function() {
        var ticketId = self.ticketId();
        console.log("📌 Fetching replies for ticket ID:", ticketId);
        
        if (ticketId) {
          fetch("http://localhost:8085/tickets/replies/" + ticketId)
            .then(function(response) {
              if (!response.ok) {
                throw new Error('Error loading replies: ' + response.status);
              }
              return response.json();
            })
            .then(function(data) {
              console.log("📌 Replies loaded:", data);
              self.ticketRepliesArray(data.notes || []);
            })
            .catch(function(error) {
              console.error("❌ Error loading replies:", error);
              self.ticketRepliesArray([]);
            });
        }
      });

      // 🔹 DATE DIFFERENCE - Función para calcular diferencia de fechas
      self.dateDifference = function (date) {
        var todaysDate = new Date();
        var messageDate = new Date(date);
        var res = Math.abs(todaysDate - messageDate) / 1000;
        var days = Math.floor(res / 86400);
        if (days < 1) {
          return "less than a day ago";
        }
        else if (days === 1) {
          return "a day ago";
        }
        else if (days <= 7) {
          return "less than a week ago";
        }
        else if (days > 7 && days <= 30) {
          return "more than a week ago";
        }
        else if (days > 30) {
          return "more than a month ago";
        }
      };

      // 🔹 TICKET STATUS - Función para obtener estado del ticket
      self.ticketStatus = function (status) {
        if (status === "Working") {
          return "Ticket status currently 'working', our team are hard at work looking into your issue.";
        } else if (status === "Closed") {
          return "Ticket status is 'closed', and is now in read-only mode. In order to help us continue to offer the best support we can, please rate your experience.";
        } else if (status === "Awaiting Customer Response") {
          return "Ticket status is currently 'awaiting customer response', our team is awaiting your reply.";
        }
      };

      // 🔹 HANDLE ATTACHED - Inicializa el editor Trumbowyg cuando el DOM está listo
      self.handleAttached = function () {
        $('#ticket-reply-area').trumbowyg(
          {
            btns: ['bold', 'italic', 'underline'],
            resetCss: true,
            removeformatPasted: true,
            autogrow: true,
            minHeight: 100,
            maxHeight: 150
          }
        );
      };
    }

    return ViewTicketViewModel;
  });
