public with sharing class FleetManagementController {
    
    @AuraEnabled(cacheable=true)
    public static List<Bus__c> getBuses() {
        return [SELECT Id, Name, Year__c, Maximum_Capacity__c, Odometer_Reading__c, Is_Air_conditioning__c, Current_Status__c
                FROM Bus__c];
    }
    
    @AuraEnabled
    public static Decimal getResaleValue(String busId) {
        Bus__c bus = [SELECT Id, Year__c, Maximum_Capacity__c, Odometer_Reading__c, Is_Air_conditioning__c , Current_Status__c FROM Bus__c WHERE Id = :busId LIMIT 1];
        
        Decimal startingPrice = 0;
        
        if (bus != null && bus.Current_Status__c == 'Ready for use') {
            if (bus.Maximum_Capacity__c == 24) {
                startingPrice = 120000;
            } else if (bus.Maximum_Capacity__c == 36) {
                startingPrice = 160000;
            }
            
            Decimal mileageReduction = Math.max(0, (bus.Odometer_Reading__c - 100000) * 0.10);
            startingPrice -= mileageReduction;
            
            if (bus.Is_Air_conditioning__c ) {
                startingPrice *= 1.03;
            }
            
            if (bus.Year__c <= 1972) {
                startingPrice *= 1.34;
            }
        }
        
        return startingPrice;
    }
}