/**
 * Lightweight Enterprise i18n Service for Zenith CRM
 */

type Dictionary = Record<string, string>;

const dictionaries: Record<string, Dictionary> = {
    'en-US': {
        'dashboard.title': 'Dashboard Overview',
        'dashboard.welcome': 'Welcome back, Admin',
        'leads.title': 'Leads Management',
        'leads.new': 'New Lead',
        'common.save': 'Save Changes',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.actions': 'Actions',
        'common.search': 'Search...',
        'nav.dashboard': 'Dashboard',
        'nav.leads': 'Leads',
        'nav.accounts': 'Accounts',
        'nav.contacts': 'Contacts',
        'nav.opportunities': 'Opportunities',
        'nav.tasks': 'Tasks',
    },
    'es-ES': {
        'dashboard.title': 'Visión General del Panel',
        'dashboard.welcome': 'Bienvenido de nuevo, Administrador',
        'leads.title': 'Gestión de Leads',
        'leads.new': 'Nuevo Lead',
        'common.save': 'Guardar Cambios',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.actions': 'Acciones',
        'common.search': 'Buscar...',
        'nav.dashboard': 'Panel',
        'nav.leads': 'Leads',
        'nav.accounts': 'Cuentas',
        'nav.contacts': 'Contactos',
        'nav.opportunities': 'Oportunidades',
        'nav.tasks': 'Tareas',
    },
    'fr-FR': {
        'dashboard.title': 'Aperçu du Tableau de Bord',
        'dashboard.welcome': 'Bon retour, Admin',
        'leads.title': 'Gestion des Leads',
        'leads.new': 'Nouveau Lead',
        'common.save': 'Sauvegarder',
        'common.cancel': 'Annuler',
        'common.delete': 'Supprimer',
        'common.actions': 'Actions',
        'common.search': 'Rechercher...',
        'nav.dashboard': 'Tableau de bord',
        'nav.leads': 'Leads',
        'nav.accounts': 'Comptes',
        'nav.contacts': 'Contacts',
        'nav.opportunities': 'Opportunités',
        'nav.tasks': 'Tâches',
    }
};

export function t(key: string, locale: string = 'en-US'): string {
    const dictionary = dictionaries[locale] || dictionaries['en-US'];
    return dictionary[key] || key;
}

export const locales = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];
