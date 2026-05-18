const departmentRepository = require('../../infrastructure/repositories/DepartmentRepository');

class DepartmentUseCase {
    async createDepartment(departmentData) {
        if (!departmentData.name) {
            throw new Error('El nombre del departamento es requerido');
        }
        return await departmentRepository.create(departmentData);
    }

    async getAllDepartments() {
        return await departmentRepository.findAll();
    }

    async getDepartmentById(id) {
        const department = await departmentRepository.findById(id);
        if (!department) {
            throw new Error('Departamento no encontrado');
        }
        return department;
    }

    async updateDepartment(id, updateData) {
        if (updateData.name !== undefined && updateData.name.trim() === '') {
            throw new Error('El nombre del departamento no puede estar vacío');
        }
        const updated = await departmentRepository.update(id, updateData);
        if (!updated) {
            throw new Error('Departamento no encontrado o no se pudo actualizar');
        }
        return updated;
    }

    async deleteDepartment(id) {
        const department = await departmentRepository.findById(id);
        if (!department) {
            throw new Error('Departamento no encontrado');
        }
        await departmentRepository.delete(id);
        return { message: 'Departamento eliminado exitosamente' };
    }
}

module.exports = new DepartmentUseCase();
