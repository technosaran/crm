// ============================================
// USER & TEAM MANAGEMENT
// ============================================

export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES' | 'SUPPORT';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    department?: string;
    avatar?: string;
    teamId?: string;
    managerId?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Team {
    id: string;
    name: string;
    description?: string;
    leaderId: string;
    parentTeamId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    role: 'LEADER' | 'MEMBER';
    joinedAt: Date;
}

// ============================================
// LEADS
// ============================================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'WORKING' | 'NURTURING' | 'QUALIFIED' | 'UNQUALIFIED';
export type LeadRating = 'HOT' | 'WARM' | 'COLD';

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    companyId?: string;
    companyName: string;
    email: string;
    phone?: string;
    status: LeadStatus;
    rating?: LeadRating;
    source: string;
    campaignId?: string;
    ownerId: string;
    annualRevenue?: number;
    numberOfEmployees?: number;
    convertedAt?: Date;
    convertedToContactId?: string;
    convertedToAccountId?: string;
    convertedToOpportunityId?: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}

// ============================================
// ACCOUNTS & CONTACTS
// ============================================

export type AccountType = 'CUSTOMER' | 'PROSPECT' | 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'OTHER';

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    industry: string;
    website?: string;
    phone?: string;
    email?: string;
    ownerId: string;
    parentAccountId?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
    annualRevenue?: number;
    numberOfEmployees?: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    mobile?: string;
    title?: string;
    department?: string;
    accountId: string;
    reportsToId?: string;
    ownerId: string;
    mailingAddress?: Address;
    isPrimary: boolean;
    doNotCall: boolean;
    doNotEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// OPPORTUNITIES & PIPELINE
// ============================================

export type OpportunityStage = 'NEW' | 'QUALIFICATION' | 'NEEDS_ANALYSIS' | 'VALUE_PROPOSITION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
export type OpportunityType = 'NEW_BUSINESS' | 'EXISTING_BUSINESS' | 'RENEWAL' | 'UPSELL';

export interface Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PipelineStage {
    id: string;
    pipelineId: string;
    name: string;
    probability: number;
    order: number;
    isClosed: boolean;
    isWon: boolean;
    createdAt: Date;
}

export interface Opportunity {
    id: string;
    name: string;
    description?: string;
    accountId: string;
    contactId?: string;
    pipelineId?: string;
    amount: number;
    stage: OpportunityStage;
    type?: OpportunityType;
    probability: number;
    expectedCloseDate: Date;
    closedAt?: Date;
    nextStep?: string;
    leadSource?: string;
    campaignId?: string;
    competitorIds?: string[];
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// PRODUCTS, PRICE BOOKS & LINE ITEMS
// ============================================

export interface Product {
    id: string;
    name: string;
    code: string;
    description?: string;
    category?: string;
    unitPrice: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PriceBook {
    id: string;
    name: string;
    description?: string;
    isStandard: boolean;
    isActive: boolean;
    validFrom?: Date;
    validTo?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface PriceBookEntry {
    id: string;
    priceBookId: string;
    productId: string;
    unitPrice: number;
    isActive: boolean;
    createdAt: Date;
}

export interface OpportunityLineItem {
    id: string;
    opportunityId: string;
    productId: string;
    priceBookEntryId?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    totalPrice: number;
    description?: string;
    createdAt: Date;
}

// ============================================
// QUOTES & CONTRACTS
// ============================================

export type QuoteStatus = 'DRAFT' | 'NEEDS_REVIEW' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'DENIED';

export interface Quote {
    id: string;
    quoteNumber: string;
    name: string;
    opportunityId: string;
    accountId: string;
    contactId?: string;
    status: QuoteStatus;
    expirationDate: Date;
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
    terms?: string;
    description?: string;
    isPrimary: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuoteLineItem {
    id: string;
    quoteId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    totalPrice: number;
    description?: string;
    sortOrder: number;
    createdAt: Date;
}

export type ContractStatus = 'DRAFT' | 'IN_APPROVAL' | 'ACTIVATED' | 'TERMINATED' | 'EXPIRED';

export interface Contract {
    id: string;
    contractNumber: string;
    name: string;
    accountId: string;
    contactId?: string;
    opportunityId?: string;
    quoteId?: string;
    status: ContractStatus;
    startDate: Date;
    endDate: Date;
    contractValue: number;
    terms?: string;
    description?: string;
    renewalDate?: Date;
    autoRenewal: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// CAMPAIGNS & MARKETING
// ============================================

export type CampaignStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
export type CampaignType = 'EMAIL' | 'WEBINAR' | 'CONFERENCE' | 'ADVERTISEMENT' | 'SOCIAL_MEDIA' | 'REFERRAL' | 'OTHER';

export interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    budgetedCost?: number;
    actualCost?: number;
    expectedRevenue?: number;
    expectedResponse?: number;
    parentCampaignId?: string;
    ownerId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CampaignMember {
    id: string;
    campaignId: string;
    leadId?: string;
    contactId?: string;
    status: 'SENT' | 'RESPONDED' | 'CONVERTED';
    respondedAt?: Date;
    createdAt: Date;
}

// ============================================
// TASKS & CALENDAR
// ============================================

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED';
export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Task {
    id: string;
    subject: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    reminderAt?: Date;
    completedAt?: Date;
    entityId?: string;
    entityType?: EntityType;
    assignedToId: string;
    ownerId: string;
    isRecurring: boolean;
    recurrenceRule?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CalendarEvent {
    id: string;
    subject: string;
    description?: string;
    location?: string;
    startTime: Date;
    endTime: Date;
    isAllDay: boolean;
    entityId?: string;
    entityType?: EntityType;
    ownerId: string;
    attendeeIds: string[];
    reminderMinutes?: number;
    isRecurring: boolean;
    recurrenceRule?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// CASES / SUPPORT
// ============================================

export type CaseStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'ON_HOLD' | 'CLOSED' | 'RESOLVED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseType = 'QUESTION' | 'PROBLEM' | 'FEATURE_REQUEST' | 'BUG' | 'OTHER';
export type CaseOrigin = 'PHONE' | 'EMAIL' | 'WEB' | 'CHAT' | 'SOCIAL_MEDIA';

export interface Case {
    id: string;
    caseNumber: string;
    subject: string;
    description?: string;
    status: CaseStatus;
    priority: CasePriority;
    type: CaseType;
    origin?: CaseOrigin;
    accountId?: string;
    contactId?: string;
    productId?: string;
    ownerId: string;
    escalatedAt?: Date;
    closedAt?: Date;
    resolution?: string;
    firstResponseAt?: Date;
    slaDeadline?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CaseComment {
    id: string;
    caseId: string;
    body: string;
    isPublic: boolean;
    authorId: string;
    createdAt: Date;
}

// ============================================
// EMAIL TEMPLATES & COMMUNICATION
// ============================================

export type EmailTemplateType = 'TEXT' | 'HTML' | 'CUSTOM';

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    type: EmailTemplateType;
    category?: string;
    folderId?: string;
    isActive: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailMessage {
    id: string;
    subject: string;
    body: string;
    fromAddress: string;
    toAddresses: string[];
    ccAddresses?: string[];
    bccAddresses?: string[];
    entityId?: string;
    entityType?: EntityType;
    templateId?: string;
    status: 'DRAFT' | 'SENT' | 'FAILED' | 'BOUNCED';
    sentAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    ownerId: string;
    createdAt: Date;
}

// ============================================
// NOTES & FILES
// ============================================

export interface Note {
    id: string;
    title?: string;
    body: string;
    entityId: string;
    entityType: EntityType;
    isPrivate: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface File {
    id: string;
    name: string;
    description?: string;
    mimeType: string;
    size: number;
    url: string;
    entityId: string;
    entityType: EntityType;
    folderId?: string;
    uploadedById: string;
    createdAt: Date;
}

export interface Folder {
    id: string;
    name: string;
    parentFolderId?: string;
    entityId?: string;
    entityType?: EntityType;
    ownerId: string;
    createdAt: Date;
}

// ============================================
// ACTIVITIES & AUDIT
// ============================================

export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'TASK_COMPLETED';
export type CallResult = 'REACHED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER';

export interface Activity {
    id: string;
    type: ActivityType;
    subject: string;
    description?: string;
    entityId: string;
    entityType: EntityType;
    callDuration?: number;
    callResult?: CallResult;
    performedById: string;
    occurredAt: Date;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'LOGOUT';
    entityId: string;
    entityType: string;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    details: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}

// ============================================
// TAGS & CUSTOM FIELDS
// ============================================

export interface Tag {
    id: string;
    name: string;
    color?: string;
    createdAt: Date;
}

export interface EntityTag {
    id: string;
    tagId: string;
    entityId: string;
    entityType: EntityType;
    createdAt: Date;
}

export type CustomFieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'PICKLIST' | 'MULTI_PICKLIST' | 'URL' | 'EMAIL' | 'PHONE' | 'CURRENCY' | 'PERCENT';

export interface CustomField {
    id: string;
    name: string;
    label: string;
    type: CustomFieldType;
    entityType: EntityType;
    isRequired: boolean;
    defaultValue?: string;
    picklistValues?: string[];
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomFieldValue {
    id: string;
    customFieldId: string;
    entityId: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// COMMON TYPES
// ============================================

export type EntityType = 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | 'CASE' | 'CAMPAIGN' | 'QUOTE' | 'CONTRACT' | 'PRODUCT';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'JPY' | 'CNY';

export interface CurrencySettings {
    id: string;
    code: Currency;
    name: string;
    symbol: string;
    exchangeRate: number;
    isDefault: boolean;
    isActive: boolean;
}
