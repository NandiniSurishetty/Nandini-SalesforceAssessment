import { LightningElement, wire, track } from 'lwc';
import getBuses from '@salesforce/apex/FleetManagementController.getBuses';
import getResaleValue from '@salesforce/apex/FleetManagementController.getResaleValue';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FleetManagement extends LightningElement {
    @track buses;
    @track selectedBus;
    @track resaleValue;

    // Fetch list of buses from the server
    @wire(getBuses)
    fetchBuses({ data, error }) {
        if (data) {
            this.buses = data;
        } else if (error) {
            console.error(error);
        }
    }

    // Handle bus card click
    handleBusClick(event) {
        console.log('event'+event);
        console.log('event'+JSON.stringify(event));

        const busId = event.detail;
        console.log('busId'+busId);

        this.selectedBus = this.buses.find(bus => bus.Id === busId);
        console.log('this.selectedBus'+JSON.stringify(this.selectedBus));
        // Retrieve the resale value of the selected bus
        this.getResale(busId);

    }

    handleSuccess(e){
        const updatedRecord = e.detail.id;
        console.log('onsuccess: ', updatedRecord);
        const et = new ShowToastEvent({
            title: 'Success',
            message: 'Bus updated successfully.',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(et);

        this.getResale(updatedRecord);

        
    }

    getResale(busId){
        getResaleValue({ busId })
            .then(result => {
                console.log('---resale---'+result);
                this.resaleValue = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
     }
}