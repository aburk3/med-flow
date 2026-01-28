import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Schemas {
        export interface Appointment {
            id: string;
            patientId: string;
            physicianId: string;
            date: string;
            type: string;
            location: string;
            status: AppointmentStatus;
        }
        export interface AppointmentDetail {
            appointment: Appointment;
            patient: Patient;
            physician: Physician;
            flow: AppointmentFlow;
        }
        export interface AppointmentFlow {
            id: string;
            appointmentId: string;
            steps: AppointmentFlowStep[];
        }
        export interface AppointmentFlowReorderRequest {
            orderedStepIds: string[];
        }
        export interface AppointmentFlowStep {
            id: string;
            title: string;
            order: number;
            status: AppointmentFlowStepStatus;
        }
        export interface AppointmentFlowStepCreateRequest {
            title: string;
            status?: AppointmentFlowStepStatus;
        }
        export type AppointmentFlowStepStatus = "not_started" | "in_progress" | "incomplete" | "complete";
        export interface AppointmentFlowStepUpdateRequest {
            title?: string;
            status?: AppointmentFlowStepStatus;
        }
        export type AppointmentStatus = "completed" | "canceled" | "no-show" | "rescheduled" | "scheduled";
        export interface DashboardPayload {
            physician: Physician;
            patients: Patient[];
            appointments: Appointment[];
            noShowCountsByPatient: {
                [name: string]: number;
            };
            appointmentsTotal: number;
        }
        export interface ErrorResponse {
            error: string;
        }
        export interface HealthStatus {
            /**
             * example:
             * ok
             */
            status: string;
        }
        export interface Patient {
            id: string;
            firstName: string;
            lastName: string;
            stage: PatientFlowStage;
            dateOfBirth: string;
            phoneNumber: string;
            emergencyContact: string;
            intakeStatus: PatientIntakeStatus;
            primaryPhysicianId: string;
            risk: PatientRisk;
            riskReason: string;
        }
        export type PatientFlowStage = "Initial Contact" | "First Meeting" | "Scheduled Surgery" | "Pre-Op Clearance" | "Post-Op Follow Up";
        export type PatientIntakeStatus = "sent" | "complete" | "incomplete";
        export type PatientRisk = "low" | "medium" | "high";
        export interface Physician {
            id: string;
            prefix: "Dr" | "NursePractitioner";
            firstName: string;
            lastName: string;
            specialty: string;
            location: string;
        }
    }
}
declare namespace Paths {
    namespace CreateAppointmentFlowStep {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = Components.Schemas.AppointmentFlowStepCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.AppointmentFlow;
            export type $400 = Components.Schemas.ErrorResponse;
            export type $404 = Components.Schemas.ErrorResponse;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace DeleteAppointmentFlowStep {
        namespace Parameters {
            export type Id = string;
            export type StepId = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            stepId: Parameters.StepId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.AppointmentFlow;
            export type $404 = Components.Schemas.ErrorResponse;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace GetAppointmentDetail {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.AppointmentDetail;
            export type $404 = Components.Schemas.ErrorResponse;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace GetAppointments {
        namespace Parameters {
            export type From = string; // date-time
        }
        export interface QueryParameters {
            from?: Parameters.From /* date-time */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Appointment[];
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace GetDashboard {
        namespace Parameters {
            export type From = string; // date-time
        }
        export interface QueryParameters {
            from?: Parameters.From /* date-time */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.DashboardPayload;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace GetHealth {
        namespace Responses {
            export type $200 = Components.Schemas.HealthStatus;
        }
    }
    namespace GetPatients {
        namespace Responses {
            export type $200 = Components.Schemas.Patient[];
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace GetPhysicians {
        namespace Responses {
            export type $200 = Components.Schemas.Physician[];
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace ReorderAppointmentFlowSteps {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = Components.Schemas.AppointmentFlowReorderRequest;
        namespace Responses {
            export type $200 = Components.Schemas.AppointmentFlow;
            export type $400 = Components.Schemas.ErrorResponse;
            export type $404 = Components.Schemas.ErrorResponse;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
    namespace UpdateAppointmentFlowStep {
        namespace Parameters {
            export type Id = string;
            export type StepId = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            stepId: Parameters.StepId;
        }
        export type RequestBody = Components.Schemas.AppointmentFlowStepUpdateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.AppointmentFlow;
            export type $400 = Components.Schemas.ErrorResponse;
            export type $404 = Components.Schemas.ErrorResponse;
            export type $500 = Components.Schemas.ErrorResponse;
        }
    }
}


export interface OperationMethods {
  /**
   * getHealth - Health check
   */
  'getHealth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetHealth.Responses.$200>
  /**
   * getDashboard - Dashboard payload
   */
  'getDashboard'(
    parameters?: Parameters<Paths.GetDashboard.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetDashboard.Responses.$200>
  /**
   * getPhysicians - Physicians
   */
  'getPhysicians'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPhysicians.Responses.$200>
  /**
   * getPatients - Patients
   */
  'getPatients'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPatients.Responses.$200>
  /**
   * getAppointments - Appointments
   */
  'getAppointments'(
    parameters?: Parameters<Paths.GetAppointments.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAppointments.Responses.$200>
  /**
   * getAppointmentDetail - Appointment detail
   */
  'getAppointmentDetail'(
    parameters?: Parameters<Paths.GetAppointmentDetail.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAppointmentDetail.Responses.$200>
  /**
   * createAppointmentFlowStep - Create appointment flow step
   */
  'createAppointmentFlowStep'(
    parameters?: Parameters<Paths.CreateAppointmentFlowStep.PathParameters> | null,
    data?: Paths.CreateAppointmentFlowStep.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateAppointmentFlowStep.Responses.$200>
  /**
   * reorderAppointmentFlowSteps - Reorder appointment flow steps
   */
  'reorderAppointmentFlowSteps'(
    parameters?: Parameters<Paths.ReorderAppointmentFlowSteps.PathParameters> | null,
    data?: Paths.ReorderAppointmentFlowSteps.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ReorderAppointmentFlowSteps.Responses.$200>
  /**
   * updateAppointmentFlowStep - Update appointment flow step
   */
  'updateAppointmentFlowStep'(
    parameters?: Parameters<Paths.UpdateAppointmentFlowStep.PathParameters> | null,
    data?: Paths.UpdateAppointmentFlowStep.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateAppointmentFlowStep.Responses.$200>
  /**
   * deleteAppointmentFlowStep - Delete appointment flow step
   */
  'deleteAppointmentFlowStep'(
    parameters?: Parameters<Paths.DeleteAppointmentFlowStep.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteAppointmentFlowStep.Responses.$200>
}

export interface PathsDictionary {
  ['/health']: {
    /**
     * getHealth - Health check
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetHealth.Responses.$200>
  }
  ['/api/dashboard']: {
    /**
     * getDashboard - Dashboard payload
     */
    'get'(
      parameters?: Parameters<Paths.GetDashboard.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetDashboard.Responses.$200>
  }
  ['/api/physicians']: {
    /**
     * getPhysicians - Physicians
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPhysicians.Responses.$200>
  }
  ['/api/patients']: {
    /**
     * getPatients - Patients
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPatients.Responses.$200>
  }
  ['/api/appointments']: {
    /**
     * getAppointments - Appointments
     */
    'get'(
      parameters?: Parameters<Paths.GetAppointments.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAppointments.Responses.$200>
  }
  ['/api/appointments/{id}']: {
    /**
     * getAppointmentDetail - Appointment detail
     */
    'get'(
      parameters?: Parameters<Paths.GetAppointmentDetail.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAppointmentDetail.Responses.$200>
  }
  ['/api/appointments/{id}/flow/steps']: {
    /**
     * createAppointmentFlowStep - Create appointment flow step
     */
    'post'(
      parameters?: Parameters<Paths.CreateAppointmentFlowStep.PathParameters> | null,
      data?: Paths.CreateAppointmentFlowStep.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateAppointmentFlowStep.Responses.$200>
  }
  ['/api/appointments/{id}/flow/steps/reorder']: {
    /**
     * reorderAppointmentFlowSteps - Reorder appointment flow steps
     */
    'patch'(
      parameters?: Parameters<Paths.ReorderAppointmentFlowSteps.PathParameters> | null,
      data?: Paths.ReorderAppointmentFlowSteps.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ReorderAppointmentFlowSteps.Responses.$200>
  }
  ['/api/appointments/{id}/flow/steps/{stepId}']: {
    /**
     * updateAppointmentFlowStep - Update appointment flow step
     */
    'patch'(
      parameters?: Parameters<Paths.UpdateAppointmentFlowStep.PathParameters> | null,
      data?: Paths.UpdateAppointmentFlowStep.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateAppointmentFlowStep.Responses.$200>
    /**
     * deleteAppointmentFlowStep - Delete appointment flow step
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteAppointmentFlowStep.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteAppointmentFlowStep.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>


export type Appointment = Components.Schemas.Appointment;
export type AppointmentDetail = Components.Schemas.AppointmentDetail;
export type AppointmentFlow = Components.Schemas.AppointmentFlow;
export type AppointmentFlowReorderRequest = Components.Schemas.AppointmentFlowReorderRequest;
export type AppointmentFlowStep = Components.Schemas.AppointmentFlowStep;
export type AppointmentFlowStepCreateRequest = Components.Schemas.AppointmentFlowStepCreateRequest;
export type AppointmentFlowStepStatus = Components.Schemas.AppointmentFlowStepStatus;
export type AppointmentFlowStepUpdateRequest = Components.Schemas.AppointmentFlowStepUpdateRequest;
export type AppointmentStatus = Components.Schemas.AppointmentStatus;
export type DashboardPayload = Components.Schemas.DashboardPayload;
export type ErrorResponse = Components.Schemas.ErrorResponse;
export type HealthStatus = Components.Schemas.HealthStatus;
export type Patient = Components.Schemas.Patient;
export type PatientFlowStage = Components.Schemas.PatientFlowStage;
export type PatientIntakeStatus = Components.Schemas.PatientIntakeStatus;
export type PatientRisk = Components.Schemas.PatientRisk;
export type Physician = Components.Schemas.Physician;
