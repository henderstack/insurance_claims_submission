interface Claim {
    policyId:string;
    incidentType: string;
    incidentDate: Date | null;
    amountClaimed: number;
    approved: boolean;
}

interface Policy {
    policyId: string;
    startDate: Date;
    endDate: Date;
    deductible: number;
    coverageLimit: number;
    coveredIncidents: string[];
}

let policies: Policy[] = [
    {
        policyId: 'POL123',
        startDate: new Date('2024-11-12'),
        endDate: new Date('2025-11-12'),
        deductible: 500,
        coverageLimit: 20000,
        coveredIncidents: ['accident', 'fire'] 
    },
    {
        policyId: 'POL456',
        startDate: new Date('2024-04-30'),
        endDate: new Date('2025-04-30'),
        deductible: 250,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'theft']   
    },
    {
        policyId: 'POL789',
        startDate: new Date('2024-08-21'),
        endDate: new Date('2025-06-21'),
        deductible: 750,
        coverageLimit: 80000,
        coveredIncidents: ['theft', 'fire', 'water damage'] 
    },
    {
        policyId: 'POL999',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2025-07-15'),
        deductible: 1000,
        coverageLimit: 120000,
        coveredIncidents: ['accident', 'theft', 'fire', 'water damage'] 
    }
];

let claims:Claim[] = [];

// Form Elements -Buttons
const btnSelPolicy = document.getElementById('btnSelPolicy')! as HTMLButtonElement;
const btnViewClaims = document.getElementById('btnViewClaims')! as HTMLButtonElement;
const submit = document.getElementById('btnSubmit')! as HTMLButtonElement;
const cancel = document.getElementById('btnCancel')! as HTMLButtonElement;


// Form Itself
const form = document.querySelector('form')!;

// Form Inputs, etc.
// Policy Input fields (disabled)
const policySelect = document.getElementById('selPolicyNum')! as HTMLSelectElement;
const txtId = document.getElementById('txtId')! as HTMLInputElement;
const dtStartDate = document.getElementById('dtStartDate')! as HTMLInputElement;
const dtEndDate = document.getElementById('dtEndDate')! as HTMLInputElement;
const nmDeductible = document.getElementById('nmDeductible')! as HTMLInputElement;
const nmCoverageLimit = document.getElementById('nmCoverageLimit')! as HTMLInputElement;

// Incident Types checkboxes
const chAccident = document.getElementById('chAccident')! as HTMLInputElement;
const chTheft = document.getElementById('chTheft')! as HTMLInputElement;
const chFire = document.getElementById('chFire')! as HTMLInputElement;
const chWaterDamage = document.getElementById('chWaterDamage')! as HTMLInputElement;

// New Claim Details Input Fields
const selIncidentType = document.getElementById('selIncidentType')! as HTMLSelectElement;
const dtIncidentDate = document.getElementById('dtIncident')! as HTMLInputElement;
const nmAmountClaimed = document.getElementById('nmAmountClaimed')! as HTMLInputElement;

const divMessages = document.getElementById('messages')! as HTMLDivElement;
const divNewClaim = document.getElementById('claimNew')! as HTMLDivElement;
const divClaimsView = document.getElementById('claimsView')! as HTMLDivElement;

// Selected Policy
let selectedPolicy:Policy;
// New Claim
let claim:Claim;

interface Opts {
    text:string;
    value:string;
}
const policyNumOpts: Opts[] = [];
const incidentTypesOpts: Opts[] = [{text:'--- Select ---', value: "none"},
                                     {text:'Accident', value: 'accident'},
                                     {text:'Theft', value:'theft'},
                                     {text:'Fire', value:'fire'},
                                     {text: 'Water Damage', value:'water damage'}
                            ];
function loadPolicyNumOpts(): void {
    let selOpt = document.createElement("option");
    selOpt.text = "--- Select ---";
    selOpt.value ="none";
    policySelect.appendChild(selOpt);
    //policyNumOpts.push({text: '--- Select ---', value: 'none'}); 
    policies.forEach(element => {
        policyNumOpts.push({text: element.policyId, value: element.policyId});
        let opt = document.createElement("option");
        opt.text = element.policyId;
        opt.value = element.policyId;
        policySelect.appendChild(opt);
    });
}

function loadIncidentTypes():void {
    incidentTypesOpts.forEach(element => {
        let opt = document.createElement("option");
        opt.text = element.text;
        opt.value = element.value;
        selIncidentType.appendChild(opt);
    })
}

function policySelected(policy:Policy) {
    selectedPolicy = policy;
}

function resetCoveredIncidents():void {
    chAccident.checked = false;
    chTheft.checked = false;
    chFire.checked = false;
    chWaterDamage.checked = false;
}

function policyAffirm():void {
    if (policySelect.selectedIndex !== 0) {
        console.log(selectedPolicy.startDate.toString().substring(0, 10));
        txtId.value = selectedPolicy.policyId;
        dtStartDate.value = selectedPolicy.startDate.toString().substring(0, 10);
        dtEndDate.value = selectedPolicy.startDate.toString().substring(0, 10);
        nmDeductible.value = selectedPolicy.deductible.toString();
        nmCoverageLimit.value = selectedPolicy.coverageLimit.toString();
        resetCoveredIncidents();
        selectedPolicy.coveredIncidents.forEach(element => {
            switch (element) {
                case 'accident':
                    chAccident.checked = true;
                    break;
                case 'theft':
                    chTheft.checked = true;
                    break;
                case 'fire':
                    chFire.checked = true;
                    break;
                case 'water damage':
                    chWaterDamage.checked = true;
                    break;
            }
        });
        divNewClaim.className = "";
        submit.disabled = false;
    } else {
        resetPolicyFields();
    }
};

function resetPolicyFields():void {
    policySelect.selectedIndex = 0;
    txtId.value = "";
    dtStartDate.value = "";
    dtEndDate.value = "";
    nmDeductible.value = "";
    nmCoverageLimit.value = "";
    divMessages.className = "hidden";
    resetCoveredIncidents();
}

function policyChange():void {
    divClaimsView.className = "hidden";
    btnViewClaims.className = "hidden";
    policies.forEach(element => {
        //console.log(`Policy Deductible ${element.deductible}`);
        if (policySelect.value === element.policyId) {
            console.log(`policyID: ${element.policyId}`);
            policySelected(element);
        } else if (policySelect.value === "none"){
            resetPolicyFields();
        }
    });
}

function selIncidentTypeChange():void {
    console.log(selIncidentType.value);
    let polId: string = selectedPolicy.policyId;
    let claimObj:Claim = {
        policyId: polId,
        incidentType: selIncidentType.value,
        incidentDate: new Date(),
        amountClaimed: 0.00,
        approved: false
    }
    claim = claimObj;
}

function setPolicies():void {
    localStorage.setItem("policies", JSON.stringify(policies));
}

function setClaim(claim:Claim):void {
    claims.push(claim);
    localStorage.setItem("claims", JSON.stringify(claims));
}

function getClaims():void {
    let strClaims = localStorage.getItem("claims");
    if (strClaims === null) strClaims = "";
    claims = JSON.parse(strClaims);
}

function getPolicies():void {
    let strPolicies = localStorage.getItem("policies");
    if (strPolicies === null) strPolicies = "";
    policies = JSON.parse(strPolicies);
}

function validateClaim():void {

}

function handleNewClaimSubmission(e:SubmitEvent) {
    e.preventDefault();
    console.log(dtIncidentDate.valueAsDate);
    claim.incidentType = selIncidentType.value;
    claim.incidentDate = dtIncidentDate.valueAsDate;
    claim.amountClaimed = Number(nmAmountClaimed.value);
    validateClaim();

}

window.onload = () => {
    console.log("Page has Loaded.");
    setPolicies();
    loadPolicyNumOpts();
    loadIncidentTypes();
    selIncidentType.addEventListener("change", selIncidentTypeChange);
    policySelect.addEventListener("change", policyChange);
    btnSelPolicy.addEventListener("click", policyAffirm);
    // Kinda dumb, but policies were supposed to be a seperate concern, and not in index.ts, but in initial configuration (no time for that)
    getPolicies();
}