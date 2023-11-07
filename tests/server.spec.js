const request = require("supertest")
const app = require("../index")

describe("Operaciones CRUD de cafes", () => {
  it("Debería devolver un arreglo con al menos 1 objeto y status code 200 en GET /cafes", async () => {
    const response = await request(app).get("/cafes");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("Debería devolver un código 404 al intentar eliminar un café con un ID que no existe", async () => {
    const cafeIdNoExistente = 999;
    const response = await request(app).delete(`/cafes/${cafeIdNoExistente}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "No se encontró ningún cafe con ese id" });
  });

  it("Debería agregar un nuevo café y devolver un código 201 en POST /cafes", async () => {
    const nuevoCafe = { id: 5, nombre: "Latte" };

    const response = await request(app)
      .post("/cafes")
      .send(nuevoCafe);

    expect(response.status).toBe(201);
    expect(Array.isArray(response.body)).toBe(true);
    const cafes = response.body;
    const cafeAgregado = cafes.find(cafe => cafe.id === nuevoCafe.id);
    expect(cafeAgregado).toEqual(nuevoCafe);
  });

  it("Debería devolver un código 400 si intentas actualizar un café con un ID diferente en los parámetros y el payload en PUT /cafes", async () => {
    const cafeExistente = { id: 1, nombre: "Latte" };

    const response = await request(app)
      .put(`/cafes/${cafeExistente.id}`)
      .send({ id: 2, nombre: "Nuevo Nombre" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "El id del parámetro no coincide con el id del café recibido" });
  });
});
