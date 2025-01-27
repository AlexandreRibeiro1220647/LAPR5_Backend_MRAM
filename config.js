import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4040, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://Cluster09180:RFRzRFhcWWBv@cluster09180.h4dvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster09180",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || "dev-05j84tecmi7hx6en.eu.auth0.com",
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || "aPDW8t4xJC8D3wDnyn8BCC9lpAilc9jq",
  AUTH0_ROLES_CLAIM: process.env.AUTH0_ROLES_CLAIM || "https://hellth.com/claims/roles",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    allergy: {
      name: "AllergyController",
      path: "../controllers/allergyController"
    },
    medicalCondition: {
      name: "MedicalConditionController",
      path: "../controllers/MedicalConditionController"
    },
    medicalRecord: {
      name: 'MedicalRecordController',
      path: '../controllers/medicalRecordController',
    }
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    allergy: {
      name: "AllergyRepo",
      path: "../repos/allergyRepo"
    },
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../repos/medicalConditionRepo"
    },
    medicalRecord: {
      name: 'MedicalRecordRepo',
      path: '../repos/medicalRecordRepo',
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    allergy: {
      name: "AllergyService",
      path: "../services/allergyService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/medicalConditionService"
    },
    medicalRecord: {
      name: 'MedicalRecordService',
      path: '../services/medicalRecordService',
    }
  },
};
