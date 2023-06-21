/* eslint-disable camelcase */
const ContactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.params;
    // listar todos os registros
    const contacts = await ContactsRepository.findAll(orderBy);

    // wildcard -> coringa
    response.setHeader('Acces-Control-Allow-Origin', '*');

    response.json(contacts);
  }

  async show(request, response) {
    // obter um registro
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }
    response.json(contact);
  }

  async store(request, response) {
    // criar um registro
    const {
      name, email, phone, category_id,
    } = request.body;
    if (!name) {
      response.status(400).json({ error: 'Name is required' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }

    if (email) {
      // busca o email do contact
      const contactExists = await ContactsRepository.findByEmail(email);
      if (contactExists) {
        return response
          .status(400)
          .json({ error: 'This Email is already been taken' });
      }
    }

    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.status(201).json(contact);
  }

  async update(request, response) {
    // editar um registro
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }
    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }
    if (!name) {
      response.status(400).json({ error: 'Name is required' });
    }
    // verificando se o id do contato existe
    const contactExists = await ContactsRepository.findById(id);
    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not found' });
    }
    if (email) {
      const contactByEmail = await ContactsRepository.findByEmail(email);
      if (contactByEmail && contactByEmail.id !== id) {
        return response
          .status(400)
          .json({ error: 'This email is already in use' });
      }
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });
    response.json(contact);
  }

  async delete(request, response) {
    // deletar um registro
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' });
    }

    await ContactsRepository.delete(id);

    response.sendStatus(204);
  }
}
module.exports = new ContactController();
