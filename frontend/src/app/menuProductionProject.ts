
import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_PRODUCTION: NbMenuItem[] = [


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
          {
            title: 'Classification Société',
            // icon: 'crop',
            //link: '/home/gestion_cimacompagnie',
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
          {
            title: 'Gestion Clause',
            icon: 'pantone-outline',
            link: '/home/gestion-clause',
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

        ],

      },

      {
        title: 'Paramétrage Production',
        icon: 'sync-outline',
        children: [
          {
            title: 'Création police et annexes',
            icon: 'pantone-outline',
            link: '/home/parametrage-production/police',
          },
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
            title: 'Code Règlement',
            // icon: 'pantone-outline', 
            //link: '/home/parametrage-systeme/commission',
          },

          // {
          //   title: 'Code Journal',
          //  // icon: 'pantone-outline', 
          //   link: '/home/parametrage-systeme/commission',
          // }, 

          // {
          //   title: 'Code Opérations',
          //  // icon: 'pantone-outline', 
          //   link: '/home/parametrage-systeme/commission',
          // }, 

          // {
          //   title: 'Plan Comptable',
          //  // icon: 'pantone-outline', 
          //   link: '/home/parametrage-systeme/commission',
          // }, 
          // {
          //   title: 'Compte',
          //  // icon: 'pantone-outline', 
          //   link: '/home/parametrage-systeme/commission',
          // },  
          // {
          //   title: 'Banque',
          //  // icon: 'pantone-outline', 
          //   link: '/home/parametrage-systeme/commission',
          // },    

        ],
      },
    ],
  },

  {

    title: 'Gestion Client',
    icon: 'flip-2-outline',
    children: [
      // {
      //   title: 'Espace Client',
      //   icon: 'globe-2-outline', 
      //   link: '/home/agenda',

      // },
      /* {
         title: 'agenda',
         icon: 'keypad-outline', 
         link: '/home/agenda',
         

        },*/
      ]
    },

  
{

  title: 'Gestion Production',
  icon: 'sync-outline',
  home: true,
  children: [    
    
    {
      title: 'Consultation',
      icon: 'globe-2-outline', 
     link: '/home/gestion-production/consultation',
    },
    
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
        title: 'Modification Police',
        //icon: 'file-remove-outline', 
       link: '/home/reemettre-facture',
       },
     ]
    },
  
    // {
    //   title: 'Test',
    //   icon: 'pantone-outline', 
    //  // link: '/home/parametrage-systeme/commission',
    // },
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
      title: 'Gestion Facture',
      icon: 'file-remove-outline', 
     
     children: [
       {
        title: 'Annuler une Facture',
        //icon: 'file-remove-outline', 
       link: '/home/annuler-facture',
       },
       {
        title: 'Encaisser une Facture',
        //icon: 'file-remove-outline', 
       link: '/home/ajout-encaissement',
       },
       
       {
        title: 'Lister Facture',
        icon: 'pantone-outline', 
        link: '/home/gestion-facture',
       }
     ],
    },
    /*{
      title: 'Gestion Quittance',
      icon: 'file-remove-outline', 
     link: '/home/gestion-quittance',
    },*/
    {
      title: 'Gestion Encaissement',
      icon: 'file-remove-outline', 

     children: [
      {
        title: 'annuler encaissement ',
        //icon: 'pantone-outline', 
        link: '/home/annuler-encaissement',
       },
       {
        title: 'Lister encaissement',
        icon: 'pantone-outline', 
        link: '/home/gestion-encaissement',
       },

     ]
    },
    {
      title: 'Gestion Acte',
      icon: 'file-remove-outline', 
     link: '/home/gestion-acte',
    },/* 
    {
      title: 'Gestion Clause',
      icon: 'pantone-outline', 
     link: '/home/gestion-clause',
    }, */
    {
      title: 'Gestion Commissions',
      icon: 'file-remove-outline', 

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

    

  ]
},
       
      {
        title: 'Consultation',
        icon: 'globe-2-outline',
        link: '/home/gestion-commerciale/consultation',

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

    title: 'Gestion Production',
    icon: 'sync-outline',
    home: true,
    children: [

      {
        title: 'Gestion Police',
        icon: 'file-remove-outline',
        link: '/home/search/policeclient',
      },
      {
        title: 'Consultation',
        icon: 'globe-2-outline',
        link: '/home/gestion-production/consultation',
      },

      // {
      //   title: 'Test',
      //   icon: 'pantone-outline', 
      //  // link: '/home/parametrage-systeme/commission',
      // },
      {
        title: 'Gestion Engagement',
        icon: 'pantone-outline',
        link: '/home/gestion-engagement',
      },
      {
        title: 'Gestion Facture',
        icon: 'file-remove-outline',

        children: [
          {
            title: 'Annuler une Facture',
            //icon: 'file-remove-outline', 
            link: '/home/annuler-facture',
          },
          {
            title: 'Encaisser une Facture',
            //icon: 'file-remove-outline', 
            link: '/home/ajout-encaissement',
          },
          {
            title: 'Lister Facture',
            icon: 'pantone-outline',
            link: '/home/gestion-facture',
          }
        ],
      },
      /*{
        title: 'Gestion Quittance',
        icon: 'file-remove-outline', 
       link: '/home/gestion-quittance',
      },*/
      {
        title: 'Gestion Encaissement',
        icon: 'file-remove-outline',

        children: [
          {
            title: 'annuler encaissement ',
            //icon: 'pantone-outline', 
            link: '/home/annuler-encaissement',
          },
          {
            title: 'Lister encaissement',
            icon: 'pantone-outline',
            link: '/home/gestion-encaissement',
          },

        ]
      },
      {
        title: 'Gestion Acte',
        icon: 'file-remove-outline',
        link: '/home/gestion-acte',
      },


    ]
  },

  {
   
    title: 'Gestion Arbitrage',
    icon: 'file-remove-outline',
    home: true,
    children: [

      {
        title: 'Gestion agrément',
        icon: 'file-remove-outline',
        link: '/home/gestion_agrement',
      },
      // {
      //   title: 'ajout agrément',
      //   icon: 'file-remove-outline',
      //   link: '/home/ajout_agrement',
      // },
      {
        title: 'Crédit export',
        icon: 'file-remove-outline',
        link: '/home/gestion_export',
      },
      {
        title: 'Crédit interieur',
        icon: 'file-remove-outline',
        link: '/home/gestion_arbitrage',
      }
    ]
  },



];
