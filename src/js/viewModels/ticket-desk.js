define(["knockout", "ojs/ojarraydataprovider"], function (
  ko,
  ArrayDataProvider
) {
  function TicketDeskViewModel() {
    const self = this;

    // 🔹 Campo de búsqueda (todavía no filtra)
    self.searchValue = ko.observable("");

    // 🔹 Datos iniciales (mock local o mock server)
    self.tickets = ko.observableArray([]);

    // Cargar datos desde el servidor mock
    fetch("http://localhost:8085/tickets")
      .then((res) => res.json())
      .then((data) => self.tickets(data.tickets))
      .catch((err) => console.error("Error loading tickets:", err));

    // 🔹 Proveedor de datos para ojListView
    self.ticketDataProvider = new ArrayDataProvider(self.tickets, {
      keyAttributes: "id",
    });

    // 🔹 Ticket seleccionado
    self.selectedTicket = ko.observable();
    self.selectedTicketTitle = ko.pureComputed(() => {
      const selected = self
        .tickets()
        .find((t) => t.id === self.selectedTicket());
      return selected ? selected.title : "Select a ticket...";
    });
  }

  return new TicketDeskViewModel();
});
