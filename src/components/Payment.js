import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
const publishableKey = "pk_test_1jygt8m3Azf0NIsRJHwYIqn0";

class Payment extends Component {
  constructor(props) {
    super(props);
  }

  onToken = token => {
    var url = "https://api-archimedes.herokuapp.com/payment";
    const body = {
      amount: 999,
      paymentToken: token,
      token: localStorage.getItem("access-token")
    };

    axios
      .post(url, body)
      .then(response => {
        if (response.data.success) {
          localStorage.setItem("isPremium", true);
          this.props.getPaymentStatus(true);
        }
        console.log(response);
      })
      .catch(error => {
        console.log("Payment Error: ", error);
      });
  };

  render() {
    return (
      <StripeCheckout
        label="Go Premium" //Component button text
        name="Archimedes" //Modal Header
        description="Upgrade to a premium account today."
        panelLabel="Go Premium" //Submit button in modal
        amount={999} //Amount in cents $9.99
        token={this.onToken}
        stripeKey={publishableKey}
        // image="" //Pop-in header image
        billingAddress={false}
      />
    );
  }
}
export default Payment;
