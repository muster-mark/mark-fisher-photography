<template>
    <form :action="action"
          method="post"
          class="contact-form"
          @submit.prevent="submitForm"
    >

        <label for="contact_name">What's your name?</label>
        <input v-model="fields.name.value"
               @blur="fields.name.touched = true"
               required
               type="text"
               id="contact_name"
               name="name"
               maxlength="100"
               :class="{'input_touched': fields.name.touched}"
        />
        <span class="form-help">Feel free to make one up if you want to provide some harsh but constructive criticism about my photos.</span>

        <label for="contact_email">What's your email address?</label>
        <input v-model="fields.email.value"
               @blur="fields.email.touched = true"
               required
               type="email"
               id="contact_email"
               name="email"
               minlength="5"
               :class="{'input_touched': fields.email.touched}"
        />

        <label for="contact_msg">How can I help you?</label>
        <textarea
                v-model="fields.message.value"
                @blur="fields.message.touched = true"
                required
                id="contact_msg"
                name="message"
                :class="{'input_touched': fields.message.touched}"
        ></textarea>

        <div class="contact-form_valid-message" v-if="allFieldsTouched">Please fill out all the fields correctly</div>

        <button type="submit" :class="['btn btn_lg', {'btn_in-progress': isSubmitting}]">{{ isSubmitting ? 'Submitting'
            : 'Submit' }}
        </button>

        <div class="contact-form_result-message contact-form_success-message" v-if="submissionSucceeded === true"
             aria-live="assertive">
            <div class="fadeInDown contact-form_result-message_icon">
                <svg-icon name="envelope"></svg-icon>
            </div>
            <div class="fadeInUp contact-form_result-message_text"><span>Your message has been sent!</span></div>
        </div>

        <div class="contact-form_result-message contact-form_fail-message" v-if="submissionSucceeded === false"
             aria-live="assertive">
            <div class="fadeInDown contact-form_result-message_icon">
                <svg-icon name="exclamation-circle"></svg-icon>
            </div>
            <div class="fadeInUp contact-form_result-message_text">
                <span>Sorry, something went wrong. Please try emailing me on <a
                        :href="'mailto:mfishe@gmail.com?subject=Enquiry%20via%20markfisher.photo&body=' + encodeURIComponent(fields.message.value)"
                        target="_blank">mfishe@gmail.com</a> instead.</span>
            </div>
        </div>


    </form>
</template>

<script lang="js">
    import SvgIcon from '../components/svg-icon.vue';

    export default {
        data() {
            return {
                action: `${window.location.origin.replace('www', 'api')}/message`,
                fields: {
                    name: {
                        value: null,
                        touched: false,
                    },
                    email: {
                        value: null,
                        touched: false,
                    },
                    message: {
                        value: null,
                        touched: false,
                    },
                },
                isSubmitting: false,
                submissionSucceeded: null,
            };
        },
        computed: {
            allFieldsTouched() {
                return Object.keys(this.fields).every((key) => this.fields[key].touched);
            },
        },
        methods: {
            resetForm() {
                Object.keys(this.fields).forEach((key) => {
                    this.fields[key].value = '';
                    this.fields[key].touched = false;
                });
            },
            submitForm() {
                this.isSubmitting = true; // Puts button into progress state
                this.submissionSucceeded = null;

                // Create data for body
                const data = {};
                Object.keys(this.fields).forEach((key) => {
                    data[key] = this.fields[key].value;
                });

                const self = this;
                fetch(this.action, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                        .then((response) => {
                                    if (response.ok) {
                                        self.submissionSucceeded = true;
                                        self.resetForm();
                                    } else {
                                        console.log(response);
                                        return Promise.reject(response);
                                    }
                                },
                        )
                        .catch((err) => {
                                    self.submissionSucceeded = false;
                                    console.log('Form submission failed');
                                    console.log(err);
                                },
                        )
                        .finally(() => {
                            self.isSubmitting = false;
                            document.querySelector('.contact-form_result-message').scrollIntoView(false);
                        });
            },
        },
        components: {
            SvgIcon,
        },
    };
</script>

<style lang="scss" scoped>

</style>
