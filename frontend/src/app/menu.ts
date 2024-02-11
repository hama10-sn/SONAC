import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Accueil',
    icon: 'home-outline',
    link: '/home/exemple',
    home: true,
  },
  {
    title: 'Administration',
    icon: 'options-2-outline',
    link: '/home',
    home: true,
    children: [
      {
        title: 'Gestion des Utilisateurs',
        icon: 'person-outline',
        link: '/home/gestion_utilisateur',
      },
      {
        title: 'Gestion des Rôles',
        icon: 'cube-outline',
        link: '/home/role',
      },

    ],
  },

  {
    title: 'Paramétrage',
    icon: 'settings-2-outline',
    link: '/home',

    children: [
      {
        title: 'Paramétrage Système',
        icon: 'settings',
        children: [

          {
            title: 'Pays',
            icon: 'globe-outline',
            link: '/home/gestion_pays',
          },
          {
            title: 'Catégorie Socio-pro',
            icon: 'layers',
            link: '/home/parametrage-systeme/categorie-socioprofessionnelle',
          },

          // {
          //   title: 'Devise/Monnaie',
          //  // icon: 'crop',
          //  // link: '/home/gestion_cimacompagnie',
          // },
          // {
          //   title: 'Nationalité',
          //  // icon: 'crop',
          //   link: '/home/gestion_cimacompagnie',
          // },
          // {
          //   title: 'Code Compagnie du Site',
          //  // icon: 'crop',
          //   link: '/home/gestion_cimacompagnie',
          // },
          // {
          //   title: 'Chemin Stockage Docments',
          //  // icon: 'crop',
          //   link: '/home/gestion_cimacompagnie',
          // },
          {
            title: 'Cima Compagnie',
            icon: 'crop',
            link: '/home/gestion_cimacompagnie',
          },
          {
            title: 'Civilité',
            icon: 'person-outline',
            link: '/home/gestion_civilite',
          },
          // {
          //   title: 'Type Souscripteur',
          // //  icon: 'person-outline',
          //   link: '/home/gestion_civilite',
          // },
          // {
          //     title: 'Type Taxe',
          //  icon: 'person-outline',
          //     link: '/home/gestion_civilite',
          //   },
          // {
          //   title: 'Type Client',
          // //  icon: 'person-outline',
          //   link: '/home/gestion_civilite',
          // },
          // {
          //   title: 'Type Société',
          // //  icon: 'person-outline',
          //   link: '/home/gestion_civilite',
          // },
          // // {
          //   title: 'Type Institution',
          // //  icon: 'person-outline',
          //   link: '/home/gestion_civilite',
          // },
          // {
          //   title: 'Typage',
          //   icon: 'keypad-outline',
          //   link: '/home/typage',

          // },
        ],
      },
      {
        title: 'Paramétrage Général',
        icon: 'keypad',
        children: [
          {
            title: 'Branche',
            icon: 'shuffle-2',
            link: '/home/parametrage-general/branches',
          },
          {
            title: 'Categorie',
            icon: 'grid-outline',
            link: '/home/gestion_categorie',
          },
          {
            title: 'Produit',
            icon: 'map-outline',
            link: '/home/parametrage-general/produits',
          },
          // {
          //   title: 'Garantie',
          //  // icon: 'map-outline',
          //   //link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Extensions',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Sous  Garantie',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Tarification',
          //  // icon: 'map-outline',
          //  // link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Modéle de Documents',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'type Clauses Particulières Contrat',
          //   //icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Clauses Actes',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Révision',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Intemédiaire',
          //  // icon: 'map-outline',
          //   //link:'/home/parametrage-general/produits',
          // },
          //  {
          //   title: 'Type Compagnie',
          //  // icon: 'map-outline',
          //  // link:'/home/parametrage-general/produits',
          // },
          //  {
          //   title: 'Type Indice',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          //  {
          //   title: 'Type Risque',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Déclaration Capital',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Garantie',
          // icon: 'map-outline',
          // link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Réassureur',
          // icon: 'map-outline',
          //link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Tiers',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Traité',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Code Réponse',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Expert',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Type Crédit',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Code Exclusion',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Code Visas',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          // {
          //   title: 'Status Contrats/Sinistre',
          //  // icon: 'map-outline',
          //   link:'/home/parametrage-general/produits',
          // },
          {
            title: 'Intermédiaire',
            icon: 'person-outline',
            link: '/home/parametrage-general/intermediaires',
          },

          {
            title: 'Compagnie',
            icon: 'stop-circle-outline',
            link: '/home/parametrage-general/compagnie',

          },
          {
            title: 'Reassureur',
            icon: 'layers',
            link: '/home/gestion_reassureur',
          },

          {
            title: 'Groupe',
            icon: 'move-outline',
            link: '/home/groupe',

          },
          {
            title: 'Filiale Compagnie',
            icon: 'shuffle-outline',
            link: '/home/filiale',
          },
          {
            title: 'Filiale Client',
            icon: 'shuffle-outline',
            link: '/home/filiale_Client',
          },
          {
            title: 'Gestion Clause',
            icon: 'pantone-outline',
            link: '/home/gestion-clause',
          },
          {
            title: 'Consultation',
            icon: 'globe-2-outline',
            link: '/home/parametrage-general/consultation',

          },

        ],

      },

      {
        title: 'Paramétrage Production',
        icon: 'sync-outline',
        children: [
          // {
          //   title: 'Création police et annexes',
          //   icon: 'pantone-outline',
          //   link: '/home/parametrage-production/police',
          // },
          // {
          //   title: 'Type Contrat/Police',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Avenant',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Mouvement Production',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Ecriture Quittance',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Gestion Police/quittance',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Séquence Avenant',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Résiliation Police/avenant',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Annulation Quittance/facture',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'type Actes',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Fractionnement Police',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type mise en attente',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          //  {
          //   title: 'type de commission',
          // icon: 'pantone-outline',
          //  link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Facultative',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Franchise',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Marché',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Risque',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Acheteur',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Marchandises',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          {
            title: 'Commission',
            icon: 'pantone-outline',
            link: '/home/parametrage-systeme/commission',
          },
          {
            title: 'Taxe',
            icon: 'square-outline',
            link: '/home/parametrage-general/taxe',

          },
          // {
          //   title: 'Code Formule Garantie',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          {
            title: 'Accessoire',
            icon: 'scissors-outline',
            link: '/home/parametrage-systeme/accessoire',
          },
        ],
      },
      {
        title: 'Paramétrage Sinistre',
        icon: 'browser-outline',
        children: [

          {
            title: 'Mode Déclaration',
            // icon: 'pantone-outline',
            // link: '/home/parametrage-systeme/commission',
          },
          // {
          //   title: 'Type Mouvement Sinistre',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type circonstances Sinistre',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Motifs de cloture',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'type annulation mouvement',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Séquence Sinistre',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Annulation Sinistre',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },
          // {
          //   title: 'Type Sinistre',
          //  // icon: 'pantone-outline',
          //   link: '/home/parametrage-systeme/commission',
          // },

        ],
      },
      {
        title: 'Paramétrage Comptable',
        icon: 'credit-card-outline',
        children: [

          {
            title: 'Gestion table des journaux comptables auxiliaires',
            // icon: 'pantone-outline',
            //link: '/home/parametrage-systeme/commission',
          },
          {
            title: 'Gestion des banques',
            // icon: 'pantone-outline',
            link: '/home/parametrage/parametrage-comptable/gestion-banque',
          },
          {
            title: 'Gestion Centralisation comptable',
            // icon: 'pantone-outline',
            //link: '/home/parametrage-systeme/commission',
          },
          {
            title: 'Gestion des dates comptables',
            // icon: 'pantone-outline',
            link: '/home/parametrage-comptable/parametrage-date-comptable',
          },
          {
            title: 'Gestion des pleins',
            // icon: 'pantone-outline',
            link: '/home/parametrage/parametrage-comptable/gestion-pleins',
          },

        ],
      },
    ],
  },

  {

    title: 'Gestion Commerciale',
    icon: 'flip-2-outline',
    children: [
      // {
      //   title: 'Espace Client',
      //   icon: 'globe-2-outline',
      //   link: '/home/agenda',

      // },
      {
        title: 'agenda',
        icon: 'keypad-outline',
        link: '/home/agenda',

      },

      {

        title: 'Portefeuille Client',
        icon: 'briefcase-outline',
        children: [
          {
            title: 'Prospect',
            icon: 'person-outline',
            link: '/home/gestion-commerciale/gestion-portefeuille/prospects'
          },
          {
            title: 'Gestion Client',
            icon: 'person-outline',
            link: '/home/gestion-client',
          },
          {
            title: 'Gestion-Contact',
            icon: 'phone-call-outline',
            link: '/home/gestion-contact',
          },
          {
            title: 'Client-360',
            icon: 'phone-call-outline',
            link: '/home/gestion-client/client360',
          },
          {
            title: 'Gestion-Demandes',
            icon: 'file-text-outline',
            children: [
              {
                title: ' Demande-Physique',
                icon: 'file-remove-outline',
                link: '/home/demande-Physique',
              },
              {
                title: ' demande-Societe',
                icon: 'file-remove-outline',
                link: '/home/demande-societe',
              },
            ]

          },
        ]
      },
      {
        title: 'Consultation',
        icon: 'globe-2-outline',
        link: '/home/gestion-commerciale/consultation',

      },
    ]
  },
  {

    title: 'Gestion Propositions',
    icon: 'cube-outline',
    link: '/home/gestion-proposition',
    home: true,
    /*  children: [
      {
        title: 'Liste Proposition ',
        icon: 'person-outline',
        link: '/home/gestion-proposition',
      },
      {
        title: 'Creer Proposition ',
        icon: 'cube-outline',
        link: '/home/search/proposition',

      },
          {
            title: 'Creation Police',
            icon: 'file-remove-outline',
            link: '/home/search/policeclient',
          },

    ],  */
  },
  {

    title: 'Gestion Production',
    icon: 'sync-outline',
    home: true,
    children: [
      {
        title: 'Gestion Police',
        icon: 'file-remove-outline',
        //link: '/home/search/policeclient',
        children: [
          {
            title: 'Creation Police',
            icon: 'file-remove-outline',
            link: '/home/search/policeclient',
          },
          {
            title: 'Modification Police CMT',
            //icon: 'file-remove-outline',
            link: '/home/reemettre-facture',
          },
          {
            title: 'Modification autre Police ',
            //icon: 'file-remove-outline',
            link: '/home/other-update',
          },
          {
            title: 'Gestion Acte',
            icon: 'file-remove-outline',
            link: '/home/gestion-acte',
          },
          {
            title: 'Gestion Engagement',
            icon: 'pantone-outline',
            link: '/home/gestion-engagement',
          },
          {
            title: 'Gestion Main Leve',
            icon: 'pantone-outline',
            link: '/home/gestion-mainleve',
          },
          {
            title: 'Gestion Sûreté',
            icon: 'file-remove-outline',
            link: '/home/engagement/gestion-surete-deposit',
          },
          {
            title: 'Consultation Engagement',
            icon: 'globe-2-outline',
            link: '/home/engagement/consultation-engagement',
          },
        ]
      },
      {
        title: 'Gestion Quittance',
        icon: 'file-remove-outline',
        children: [
          {
            title: 'Annuler une Facture',
            //icon: 'file-remove-outline',
            link: '/home/annuler-facture',
          },

          {
            title: 'Lister Facture',
            icon: 'pantone-outline',
            link: '/home/gestion-facture',
          }
        ],
      },
      // {
      //   title: 'Gestion Financiere',
      //   icon: 'file-remove-outline',
      //   children: [
      //     {
      //       title: 'Gestion Encaissement',
      //       icon: 'file-remove-outline',

      //       children: [
      //         // {
      //         //   title: 'annuler encaissement ',
      //         //   //icon: 'pantone-outline',
      //         //   link: '/home/annuler-encaissement',
      //         // },
      //         {
      //           title: 'Lister encaissement',
      //           icon: 'pantone-outline',
      //           link: '/home/gestion-encaissement',
      //         },

      //       ]
      //     },
      //     // {
      //     //   title: 'Gestion Commissions',
      //     //   icon: 'file-remove-outline',

      //     //   children: [
      //     //     {
      //     //       title: 'Payer commissions ',
      //     //       //icon: 'pantone-outline',
      //     //       link: '/home/payer-commissions',
      //     //     },
      //     //     {
      //     //       title: 'Commissions a payer',
      //     //       //icon: 'pantone-outline',
      //     //       link: '/home/liste-commissions',
      //     //     },

      //     //   ]
      //     // },
      //   ]
      // },
      {
        title: 'Lister encaissement',
        icon: 'pantone-outline',
        link: '/home/gestion-encaissement',
      },
      {
        title: 'Consultation',
        icon: 'globe-2-outline',
        link: '/home/gestion-production/consultation',
      },
    ]
  },
  {

    title: 'Gestion Production Reprise',
    icon: 'sync-outline',
    link: '/home/search-reprise/policeclient',
    home: true,
  },

  {
    title: 'Gestion des Tiers',
    icon: 'sync-outline',
    children: [
      {
        title: 'Gestion acheteurs',
        icon: 'person-outline',
        link: '/home/gestion-acheteurs',
      },
      {
        title: 'Gestion bénéficiaires',
        icon: 'person-outline',
        link: '/home/gestion-tiers/gestion-beneficiaires',
      },
      {
        title: 'Gestion tiers débiteurs',
        icon: 'person-outline',
        link: '/home/gestion-tiers/gestion-tiers-debiteurs',
      },
    ]
  },
  {
    title: 'Gestion Sinistre',
    icon: 'map-outline',
    link: '',
    home: true,
    children: [
      {
        title: 'Déclaration menace sinistres',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/declaration-menace-sinistre/ajout'
      },
      {
        title: 'Déclaration de sinistres',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/declaration-sinistre/ajout'
      },
      {
        title: 'Gestion menaces sinistre',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/liste-menace-sinistre'
      },
      {
        title: 'Gestion sinistre',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/liste-sinistre'
      },
      {
        title: 'Clôture sinistre',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/cloture-sinistre'
      },
      {
        title: 'Réouvrir sinistre',
        icon: 'pantone-outline',
        link: '/home/gestion-sinistre/reouvrir-sinistre'
      },
      {
        title: 'Gestion Moratoires',
        icon: 'layers-outline',
        link: 'gestion-moratoire/liste-sinistre-recours',
      },
      // {
      //   title: 'Traitements périodiques',
      //   icon: 'globe-2-outline',
      //   link: '/home/gestion-sinistre/traitement-periodique'
      // },
      {
        title: 'Consultation',
        icon: 'globe-2-outline',
        link: '/home/gestion-sinistre/consultation'
      }
    ]
  },
  {
    title: 'Traitements périodiques',
    icon: 'map-outline',
    link: '',
    home: true,
    children: [
      // {
      //   title: 'Traitements périodiques',
      //   icon: 'globe-2-outline',
      //   link: '/home/gestion-sinistre/traitement-periodique'
      // },
      {
        title: 'Traitement Journalier',
        icon: 'globe-2-outline',
        link: '/home/gestion-sinistre/traitement-periodique/traitement-journalier'
      },
      {
        title: 'Traitement mensuel',
        icon: 'globe-2-outline',
        link: '/home/gestion-sinistre/traitement-periodique/traitement-mensuel'
      },
      {
        title: 'Traitement annuel',
        icon: 'globe-2-outline',
        link: '/home/gestion-sinistre/traitement-periodique/traitement-annuel'
      },
    ]
  },
  {
    title: 'Gestion Comptabilité',
    icon: 'layers-outline',
    link: '',
    home: true,
    children: [
      {
        title: 'Gestion financière facture',
        icon: 'pantone-outline',
        link: '',
        children: [
          {
            title: 'Encaisser facture',
            icon: 'pantone-outline',
            link: '/home/ajout-encaissement'
          },
          {
            title: 'Encaisser facture avec avoir',
            icon: 'pantone-outline',
            link: '/home/ajout-encaissement-avoir'
          },
          {
            title: 'Annuler encaissement facture',
            icon: 'pantone-outline',
            link: '/home/annuler-encaissement'
          },
          {
            title: 'Lister encaissement',
            icon: 'pantone-outline',
            link: '/home/gestion-comptabilite/gestion-encaissement',
          },
        ]
      },
      {
        title: 'Gestion Commissions',
        icon: 'file-remove-outline',
        // link: '/home',
        children: [
          {
            title: 'Payer commissions ',
            //icon: 'pantone-outline',
            link: '/home/payer-commissions',
          },
          {
            title: 'Commissions a payer',
            //icon: 'pantone-outline',
            link: '/home/liste-commissions',
          },
        ]
      },
      {
        title: 'Gestion financière sinistre',
        icon: 'pantone-outline',
        link: '',
        children: [
          {
            title: 'Règlement financier sinistre',
            icon: '',
            link: '/home/gestion-comptable/gestion-reglement-financier'
          },
          {
            title: 'Annulation règlement financier sinistre',
            icon: '',
            link: '/home/gestion-comptable/gestion-reglement-financier/annulation-reglement-financier'
          },
          {
            title: 'Encaissement financier recours',
            icon: '',
            link: '/home/gestion-comptable/encaissement-recours'
          },
          {
            title: 'Annulation encaissement financier recours',
            icon: '',
            link: '/home/gestion-comptable/annulation-encaissement-recours'
          },
          {
            title: 'Encaissement financier moratoire / pénalité',
            icon: '',
            link: '/home/gestion-comptable/encaissement-moratoire-penalite'
          }
        ]
      },
      {
        title: 'Gestion centralisation comptable',
        icon: 'pantone-outline',
        link: '/home',
        children: [
          {
            title: 'Consultation centralisation',
            icon: '',
            link: ''
          },
          {
            title: 'Comptabilisation comptabilité générale',
            icon: '',
            link: ''
          }
        ]
      },
      // {
      //   title: 'Traitement périodique',
      //   icon: 'globe-2-outline',
      //   link: '/home',
      //   children: [
      //     {
      //       title: 'Traitements journaliers',
      //       icon: 'globe-2-outline',
      //       link: '/home/gestion-comptable/traitement-periodique/traitement-journalier'
      //     }
      //   ]
      // }
    ]
  },
  {
    title: 'Gestion Editique',
    icon: 'file-text-outline',
    link: '',
    home: true,
    children: [

      {
        title: 'Test',
        icon: 'pantone-outline',
        // link: '/home/parametrage-systeme/commission',
      },
    ]
  },
  {

    title: 'Solvabilité',
    icon: 'sun-outline',
    link: '',
    home: true,
    children: [

      {
        title: 'Test',
        icon: 'pantone-outline',
        // link: '/home/parametrage-systeme/commission',
      },
    ]
  },
  {

    title: 'Gestion Créance Confiée',
    icon: 'minus-square-outline',
    link: '',
    home: true,
    children: [

      {
        title: 'Test',
        icon: 'pantone-outline',
        // link: '/home/parametrage-systeme/commission',
      },
    ]
  },

  // ============================== POUR CORRECTION DE LA REPRISE ==========================
  {

    title: 'CORRECTION REPRISE',
    icon: 'flip-2-outline',
    children: [
      {
        title: 'Gestion Client',
        icon: 'person-outline',
        link: '/home/reprise/gestion-client-reprise',
      },
    ]
  },

  // ================================== FIN REPRISE==================================================

];
