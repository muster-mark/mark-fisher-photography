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

        <button type="submit" :class="['btn btn_lg', {'btn_in-progress': isSubmitting}]">{{
                isSubmitting ? "Submitting"
                        : "Submit"
            }}
        </button>

        <div class="contact-form_result-message contact-form_success-message" v-if="submissionSucceeded === true"
             aria-live="assertive">
            <div class="fadeInDown contact-form_result-message_icon">
                <SvgIcon name="envelope"></SvgIcon>
            </div>
            <div class="fadeInUp contact-form_result-message_text"><span>Your message has been sent!</span></div>
        </div>

        <div class="contact-form_result-message contact-form_fail-message" v-if="submissionSucceeded === false"
             aria-live="assertive">
            <div class="fadeInDown contact-form_result-message_icon">
                <SvgIcon name="exclamation-circle"></SvgIcon>
            </div>
            <div class="fadeInUp contact-form_result-message_text">
                <span>Sorry, something went wrong. Please try emailing me on <a
                        :href="fallbackEmailHref"
                        target="_blank">{{ fallbackEmail }}</a> instead.</span>
            </div>
        </div>

    </form>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import SvgIcon from "../components/svg-icon.vue";

type Fields = {
    name: { value: string, touched: boolean },
    email: { value: string, touched: boolean },
    message: { value: string, touched: boolean }
};

const action = `${window.location.origin.replace("www", "api")}/message` as const;

const fields = ref<Fields>({
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
    }
});

const isSubmitting = ref(false);
const submissionSucceeded = ref<boolean>(null);
const fallbackEmail = "mfishe@gmail.com";
const allFieldsTouched = computed(() => Object.keys(fields.value).every((key: keyof Fields) => fields.value[key].touched));
const fallbackEmailHref = computed(() => {
    const query = new URLSearchParams();
    query.set("subject", "Enquiry via markfisher.photo");
    if (fields.value.message.value) {
        query.set("body", fields.value.message.value);
    }

    return `mailto:${fallbackEmail}?${query.toString()}`;
});

function resetForm() {
    Object.keys(fields.value).forEach((key: keyof Fields) => {
        fields.value[key].value = "";
        fields.value[key].touched = false;
    });
}

function submitForm() {
    isSubmitting.value = true; // Puts button into progress state
    submissionSucceeded.value = null;

    // Create data for body
    const data: { [key: string]: string } = {};
    Object.keys(fields.value).forEach((key: keyof Fields) => {
        data[key] = fields.value[key].value;
    });

    fetch(action, {
        method: "POST",
        body: JSON.stringify(data),
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
                if (response.ok) {
                    submissionSucceeded.value = true;
                    resetForm();
                    return Promise.resolve();
                } else {
                    return Promise.reject(response);
                }
            })
            .catch((err) => {
                submissionSucceeded.value = false;
                console.error("Form submission failed");
                console.error(err);
            })
            .finally(() => {
                isSubmitting.value = false;
                document.querySelector(".contact-form_result-message").scrollIntoView(false);
            });
}
</script>
