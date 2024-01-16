const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const permissionSchema = new Schema({
  full_access: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  approve: { type: Boolean, default: false },
})

const permissionSchemaWithoutApprove = new Schema({
  full_access: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
})

const contactSchema = new Schema({
  customers: permissionSchemaWithoutApprove,
  vendors: permissionSchemaWithoutApprove,
  manage_vendor_bank_account: { type: Boolean, default: false },
})

const itemsSchema = new Schema({
  items: permissionSchema,
  composite_items: permissionSchema,
  warehouse: permissionSchema,
  transfer_orders: permissionSchema,
  inventory_adjustment: permissionSchema,
  price_list: permissionSchema,
})

const salesSchema = new Schema({
  invoices: permissionSchema,
  customer_payments: permissionSchema,
  sales_orders: permissionSchema,
  package: permissionSchema,
  shipment_orders: permissionSchema,
  credit_notes: permissionSchema,
  sales_return: permissionSchema,
  sales_return_receive: permissionSchema,
})

const purchasesSchema = new Schema({
  bills: permissionSchema,
  vendor_payments: permissionSchema,
  purchase_orders: permissionSchema,
  purchase_receive: permissionSchema,
  vendor_credits: permissionSchema,
})

const accountantSchema = new Schema({
  chart_of_account: permissionSchema,
})

const settingsSchema = new Schema({
  settings: { type: Boolean, default: false },
  update_organization_profile: { type: Boolean, default: false },
  users: { type: Boolean, default: false },
  export_data: { type: Boolean, default: false },
  general_preferences: { type: Boolean, default: false },
  taxes: { type: Boolean, default: false },
  personal_information_access: { type: Boolean, default: false },
  payment_terms: { type: Boolean, default: false },
  templates: { type: Boolean, default: false },
  email_templates: { type: Boolean, default: false },
  reporting_tags: { type: Boolean, default: false },
  manage_integration: { type: Boolean, default: false },
  automation: { type: Boolean, default: false },
})

const documentsSchema = new Schema({
  documents: { type: Boolean, default: false },
  view_documents: { type: Boolean, default: false },
  upload_documents: { type: Boolean, default: false },
  delete_documents: { type: Boolean, default: false },
  manage_folder: { type: Boolean, default: false },
})

const dashboardSchema = new Schema({
  dashboard: { type: Boolean, default: false },
  sales_activity: { type: Boolean, default: false },
  inventory_summary: { type: Boolean, default: false },
  product_details: { type: Boolean, default: false },
  top_selling_items: { type: Boolean, default: false },
  purchase_order: { type: Boolean, default: false },
  sales_order: { type: Boolean, default: false },
  sales_order_summary: { type: Boolean, default: false },
})

const moduleSchema = new Schema({
  contacts: contactSchema,
  items: itemsSchema,
  sales: salesSchema,
  purchases: purchasesSchema,
  accountant: accountantSchema,
  settings: settingsSchema,
  documents: documentsSchema,
  dashboard: dashboardSchema,
})

const roleSchema = new Schema({
  role_name: { type: String, required: true },
  description: { type: String },
  modules: moduleSchema,
})

const RoleSchema = new Schema(
  {
    unique_company_id: {
      type: String,
      trim: true,
    },
    company: {
      type: ObjectId,
      ref: 'User',
    },
    role_modules: [roleSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Role', RoleSchema)
