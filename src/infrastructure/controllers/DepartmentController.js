const departmentUseCase = require('../../application/useCases/DepartmentUseCase');

class DepartmentController {
    async create(req, res, next) {
        try {
            const department = await departmentUseCase.createDepartment(req.body);
            res.status(201).json({
                message: 'Departamento creado exitosamente',
                department
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const departments = await departmentUseCase.getAllDepartments();
            res.status(200).json(departments);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const department = await departmentUseCase.getDepartmentById(id);
            res.status(200).json(department);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await departmentUseCase.updateDepartment(id, req.body);
            res.status(200).json({
                message: 'Departamento actualizado exitosamente',
                department: updated
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await departmentUseCase.deleteDepartment(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DepartmentController();
