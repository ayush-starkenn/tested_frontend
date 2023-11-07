import "@react-google-maps/api";
import { tab } from "@testing-library/user-event/dist/tab";
const admin = [];
const user = [];
const link = 'http://localhost:3000';
const min = 1000; // Minimum 4-digit number
const max = 9999; // Maximum 4-digit number

const rn = Math.floor(Math.random() * (max - min + 1)) + min;
const email = `ayush${rn}@gmail.com`;
const myname = `ayush + ${rn}`;
const phone=`888888${rn}`;
const phone1 = `8834888${rn}`;
const phone2 =`888854${rn}`;

describe('testing frontend e2e', () => {

  

  beforeEach(() => {
    cy.visit(`${link}/signin`);
    
  });

  it('suite case for admin', () => {
    // Login admin
    cy.get('#email').type('eye@starkenn.com');
    cy.get('#password').type('qwerty');
    cy.contains('Sign In').click();

    cy.request('POST', 'http://localhost:8080/api/login', {
      email: 'eye@starkenn.com',
      password: 'qwerty',
    }).then(async(response) => {
      cy.wrap(response.body.message).should('eq', 'Login successful!');
      const admin_data = response.body.user;
      const admin_token = response.body.token;
      const admin_user_uuid = admin_data.user_uuid;
      cy.log(admin_user_uuid);

      // Set cookies for the authenticated session
      cy.setCookie('user_uuid', admin_user_uuid);
      cy.setCookie('token', admin_token);

      admin.push(admin_user_uuid);
      admin.push(admin_token);

      // Continue the test after successful login
      // Admin dashboard
       cy.contains('Customers').click();
       cy.contains('New Customer').click();
       cy.get('#f_name').type(myname);
       cy.get('#l_name').type('tester+FS');
       cy.get('#email').type(email);
       cy.get('#password').type('qwerty');
       cy.get('#confirmPassword').type('qwerty');
       cy.get('#user_type').click();
       cy.get('.p-dropdown-item').eq(0).click();
       cy.get('#company_name').type('ST');
       cy.get('#phone').type(phone);
       cy.get('#address').type('baner');
       cy.get('#city').type('pune');
       cy.get('#state').type('MH');
       cy.get('#pincode').type('411038');
       cy.get('#userActive').click();
       cy.contains('Add Customer').click();
 
       //check for edit
       cy.wait(6000)
       cy.get('#edit_customer').click();
       cy.get('#company_name').type('Starkenn Technologies');
       cy.get('#update_customer').click();
       cy.wait(5000);

       //check for delete
      //  cy.get('#delete').click();
      //  cy.get('#succes_delete').click();

      // ------- done for the customers ------------------

      //--------------start devices---------------------


                                  //in this I need the  customer id so use req to access it
                                    cy.request('POST' , `http://localhost:8080/api/login` , 
                                    {
                                      email : email,
                                      password : "qwerty"
                                    }).then((res)=> {
                                      const user_uuid = res.body.user.user_uuid;
                                      const user_token = res.body.token;
                                      user.push(user_uuid);
                                      user.push(user_token);
                                    })

      //code for testing the devices
      cy.visit(`${link}/admin/dashboard`);
      cy.contains('Devices').click();
      cy.contains('New Device').click();
      cy.get('#device_id').type(`ECU-${rn}`)
      cy.get('#device_type').click();
      cy.get('.p-dropdown-item').eq(0).click();
      cy.get('#user_uuid').click();
      cy.get('.p-dropdown-item').last().click();
      cy.get('#status').click();
      cy.get('.p-dropdown-item').eq(0).click();

      cy.contains('Add Device').click();
      cy.wait(6000);

      cy.visit(`${link}/admin/dashboard`);
      cy.contains('Devices').click();
      cy.contains('New Device').click();
      cy.get('#device_id').type(`IOT-${rn}`)
      cy.get('#device_type').click();
      cy.get('.p-dropdown-item').eq(1).click();
      cy.get('#user_uuid').click();
      cy.get('.p-dropdown-item').last().click();
      cy.get('#status').click();
      cy.get('.p-dropdown-item').eq(0).click();
      cy.get('#sim_number').type(phone1);

      cy.contains('Add Device').click();
      cy.wait(6000);

      cy.visit(`${link}/admin/dashboard`);
      cy.contains('Devices').click();
      cy.contains('New Device').click();
      cy.get('#device_id').type(`DMS-${rn}`)
      cy.get('#device_type').click();
      cy.get('.p-dropdown-item').eq(2).click();
      cy.get('#user_uuid').click();
      cy.get('.p-dropdown-item').last().click();
      cy.get('#status').click();
      cy.get('.p-dropdown-item').eq(0).click();
      cy.get('#sim_number').type(phone2);

      cy.contains('Add Device').click();
      cy.wait(6000);
      cy.log('device for the following customer added successfully');

      //edit device
      cy.get('#edit-devices').click();
      cy.get('#device_id').type(`ECU-1-${rn}`);
      cy.get('#edit_device').click();
      cy.wait(5000);

      cy.visit(`${link}/admin/dashboard`);
      cy.contains('Vehicles').click();
      cy.wait(3000);
      



      //--------------end devices here-------------------
      
      //feature set------------------start----------------
      cy.visit(`${link}/admin/feature-set`);
      cy.contains('Feature Set').click();
      cy.contains('New Feature Set').click();
      cy.get('#username').type(`F-1-${rn}`);
      cy.get('#featureset_users').click();
      cy.get('.p-dropdown-item').first().click();
      cy.contains('Add Feature Set').click();
      cy.wait(6000);

      cy.get('#edit_fs').click();
      cy.get('#activationSpeed').type(8);
      cy.contains('Edit Feature Set').click();
      cy.wait(5000);

      //feature set------------------end------------------
      //Analytics threshold
      cy.visit(`${link}/admin/analytics-threshold`);
      cy.contains('New Analytics Threshold').click();
      cy.get('#title').type(`AT@${rn}`)
      cy.get('#at_cust').click();
      cy.get('.p-dropdown-item').first().click();
      cy.get('#brake-input').type('900');
      cy.get('#tailgating-input').type('900');
      cy.get('#rash-driving-input').type('950');
      cy.get('#sleep-alert-input').type('900');
      cy.get('#over-speed-input').type('900');
      cy.get('#green-zone-input').type('900');
      cy.get('#minimum-distance-input').type('900');
      cy.get('#minimum-driver-rating-input').type('4');
      cy.get('#ttc-difference-percentage-input').type('67');
      cy.get('#total-distance-input').type('900');
      cy.get('#halt-duration-input').type('900');
      cy.get('#userActive').click();
      cy.contains('Add Analytic Threshold').click();

                cy.wait(6000);
      //edit;
      cy.get('#edit_at').click();
      cy.get('#sleep-alert-input').clear().type("200");
      cy.contains('Update').click();
      cy.visit(`${link}/admin/dashboard`);
      cy.get('#notifications').click();
      cy.wait(2000);
      cy.visit(`${link}/admin/dashboard`);
      cy.get('#log').click();
      cy.get('#logout').click();

    });

    cy.on('uncaught:exception', (err, runnable) => {
      // Prevent Cypress from failing the test when an uncaught error occurs
      return false;
    });
    //login user

    

    
    

    

    //devices_customers
    // cy.get('.route1').click();
    // cy.visit(`${link}/customer/dashboard`)
    cy.get('#email').type(`${email}`);
    cy.get('#password').type('qwerty');
    cy.contains('Sign In').click();
    
    //vehicles_customers
    cy.get('.route2').click();
    
    
cy.contains('New Vehicle').click();
cy.get('#vehicle_name').type('maaruti');
cy.get('#vehicle_registration').type(`maaruti-${rn}`);
cy.get('#ecu').click({ force: true });
cy.get('.p-dropdown-item').first().click();
cy.get('#iot').click();
cy.get('.p-dropdown-item').first().click();
cy.get('#dms').click();
cy.get('.p-dropdown-item').first().click();
cy.get('#featureset_uuid').click();
cy.get('.p-dropdown-item').first().click();

    // cy.get('#webpack-dev-server-client-overlay').should('not.exist');


    cy.contains('Add Vehicle').click();
    cy.wait(6000);

    cy.get('#edit_c_vehicle').click();
    cy.get('#vehicle_name').clear().type('maaruti-edited');

    cy.get('#update_c_b').click();

    cy.wait(4000);
    cy.get('#vehicle_grid').click();

    cy.get('#edit_the_vehicle').click();
    cy.get('#vehicle_name').clear().type('maaruti-edited-again');
    cy.get('#update_vehicle_grid').click();
    cy.wait(4000);
    cy.get('#vehicle_list_icon').click();

    cy.get('#fs_default').click();
    cy.get('#fuel_thrsh').clear().type(9);
    cy.get('#ufs').click();
    cy.wait(4000);

    // cy.visit(`${link}/customer/dashboard`);

    //contacts
    cy.get('.route7').click();
    cy.get('#contact_add').click();
    cy.get('#contact_first_name').type('Bhul');
    cy.get('#contact_last_name').type('gaya');
    cy.get('#contact_email').type(`ag${rn}@gmail.com`);
    cy.get('#contact_mobile').type(`557766${rn}`);
    cy.get('#add_contact_button').click();
    cy.wait(4000);

    //edit 
    cy.get('#edit_contact').click();
    cy.get('#contact_first_name').clear().type('Bhaut bhul');
    cy.get('#edit_con_btn').click();
    // cy.visit(`${link}/customer/dashboard`);


    //alert_triggers_customer
    cy.get('.route5').click();
    cy.get('#new_at').click();
    cy.wait(1000);
    cy.get('#trigger_type').click();
    cy.get('.p-dropdown-item').first().click();
    cy.get('#trigger_name').type('testing_trigger');
    cy.get('#vehicle_uuid').click();
    cy.get('.p-dropdown-item').first().click();
    cy.get('#trigger_description').type('anything is valid');
    cy.get('#checkbox-e').eq(0).check();
    cy.get('#checkbox-p').eq(0).check();
    cy.get('#add_trigger').click();

    cy.wait(5000);
    cy.get('#edit_trigger').click();
    cy.get('#trigger_name').type('testing_trigger_edited');
    cy.get('#edit_trigger_button').click();
    cy.wait(4000);
    


    // cy.visit(`${link}/customer/dashboard`);
    

    //contacts_customers
    
    //reports_customers
    cy.get('.route6').click();

// Generate report
cy.contains('Generate').click();
cy.get('#title').type('Testing_report');

// From date
cy.get('#from_date').click();
cy.get('span[data-pc-section="daylabel"]').contains('4').click();

cy.wait(3000);
// To date
cy.get('#to_date').click();
cy.get('span[data-pc-section="daylabel"]').contains('7').click();

cy.wait(5000);     //check here for to_date
cy.get('#select_vehicle')
.click()
.get('.p-multiselect-panel .p-multiselect-items-wrapper .p-multiselect-item')
.first()
.click()
cy.get('.p-multiselect-close')
.click()
cy.wait(4000)
cy.get('#select-event')
.click()
.get('.p-multiselect-panel .p-multiselect-items-wrapper .p-multiselect-item')
.first()
.click()
cy.get('.p-multiselect-close')
.click()
cy.wait(2000)
.get('#select_contacts')
.click()
.get('.p-dropdown-item')
.first()
.click()
.get('#generate_report_btn')
.click();


     cy.wait(4000);

     cy.contains('Schedule').click();
cy.get('#title').type('schedule report');

cy.get('#vehicles-schedule')
  .click()
  .get('.p-multiselect-panel .p-multiselect-items-wrapper .p-multiselect-item').first().click()
  cy.get('.p-multiselect-close').click()

  cy.wait(3000)

cy.get('#events_schedule')
  .click()
  .wait(2000) // You might need to adjust the wait time
  .get('.p-multiselect-panel .p-multiselect-items-wrapper .p-multiselect-item').first().click()
  cy.get('.p-multiselect-close').click()

  cy.wait(2000)
cy.get('#contact_schedule')
  .click()
  .get('.p-dropdown-item').first().click();

cy.get('#repeat_schedule')
  .click()
  .get('.p-dropdown-item').first().click();

cy.get('#schedule_btn').click();


    // cy.visit(`${link}/customer/dashboard`);


  });
});
