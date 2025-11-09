// 🎯 VIEW TICKET - ViewModel para ver detalles del ticket
// ==========================================================

define(['ojs/ojcore',
  'knockout',
  'jquery',
  'appUtils',
  'ojs/ojlistview',
  'ojs/ojarraydataprovider',
],
  function (oj, ko, $, appUtils) {

    function ViewTicketViewModel(params) {
      var self = this;

      console.log("📌 ViewTicketViewModel - params:", params);
      console.log("📌 ticketModel observable:", params.ticketModel());

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

      // 🔹 TICKET MODEL - Computed para escuchar cambios de ticket
      self.ticketModel = ko.computed(function () {
        var ticket = params.ticketModel();
        console.log("📌 Ticket model changed:", ticket);
        
        if (ticket) {
          self.ticketId(ticket.id);
          self.title(ticket.title);
          self.author(ticket.author);
          self.dateCreated(ticket.dateCreated);
          self.message(ticket.message);
          self.status(ticket.status);
          self.attachment(ticket.attachment);
          console.log("📌 Ticket data updated:", {
            title: self.title(),
            status: self.status()
          });
        }
        return ticket;
      });

      // 🔹 FETCH REPLIES - Suscribirse a cambios de ticketId para cargar replies
      self.ticketId.subscribe(function() {
        var ticketId = self.ticketId();
        console.log("📌 Fetching replies for ticket ID:", ticketId);
        
        if (ticketId) {
          $.ajax({
            url: "http://localhost:8085/tickets/replies/" + ticketId,
            type: "GET",
            dataType: "json",
            success: function(data) {
              console.log("📌 Replies loaded:", data);

              self.ticketRepliesArray(data.notes || []);
            },
            error: function(error) {
              console.error("❌ Error loading replies:", error);
              self.ticketRepliesArray([]);
            }
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
    }

    return ViewTicketViewModel;
  });
