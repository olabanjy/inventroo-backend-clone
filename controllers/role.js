const Role = require('../models/Role')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

exports.addRole = async (req, res) => {
  try {
    const { unique_company_id, company, role_name, description, modules } =
      req.body.roleData

    const existingRole = await Role.findOne({
      unique_company_id: unique_company_id,
      'role_modules.role_name': role_name,
    })
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists.' })
    }

    const newRole = new Role({
      unique_company_id,
      company,
      role_modules: [
        {
          role_name,
          description,
          modules,
        },
      ],
    })
    await newRole.save()
    res.status(201).json({ message: 'Role added successfully.', data: newRole })
  } catch (error) {
    res.status(500).json({ message: 'Error adding role.', error })
  }
}

exports.getRole = async (req, res) => {
  try {
    const roles = await Role.find({ company: req.user.id })
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(roles)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.getRoleById = async (req, res) => {
  try {
    const roles = await Role.findOne({ _id: req.params.id })
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(roles)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.editRole = async (req, res) => {
  const { role_name, description, modules } = req.body.newdata
  try {
    const updated = await Role.findOneAndUpdate(
      { _id: req.params.id },
      {
        role_modules: [
          {
            role_name,
            description,
            modules,
          },
        ],
      },
      { new: true }
    ).exec()
    res.json(updated)
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRole = await Role.findByIdAndDelete(id)
    if (!deletedRole) {
      res.status(404).json({ message: 'Role not found.' })
      return
    }
    res
      .status(200)
      .json({ message: 'Role deleted successfully.', data: deletedRole })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role.', error })
  }
}

exports.cloneRole = async (req, res) => {
  try {
    const role = await Role.findById({ _id: req.body.roleData })

    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }

    const clonedRole = new Role({
      ...role.toObject(),
      _id: new ObjectId(),
    })

    const savedRole = await clonedRole.save()

    res.json({ message: 'Role cloned successfully', clonedRole: savedRole })
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    })
  }
}
