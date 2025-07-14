document.addEventListener("DOMContentLoaded", async () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      if (activitySelect) {
        activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      }

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        // Create card
        const card = document.createElement("div");
        card.className = "activity-card";

        // Title
        const title = document.createElement("h4");
        title.textContent = name;
        card.appendChild(title);

        // Description
        const desc = document.createElement("p");
        desc.textContent = details.description;
        card.appendChild(desc);

        // Schedule
        const sched = document.createElement("p");
        sched.innerHTML = `<strong>Schedule:</strong> ${details.schedule}`;
        card.appendChild(sched);

        // Max participants
        const max = document.createElement("p");
        max.innerHTML = `<strong>Max Participants:</strong> ${details.max_participants}`;
        card.appendChild(max);

        // Participants section
        const partSection = document.createElement("div");
        partSection.className = "participants-section";
        const partTitle = document.createElement("p");
        partTitle.innerHTML = `<strong>Participants:</strong>`;
        partSection.appendChild(partTitle);

        if (details.participants && details.participants.length > 0) {
          const ul = document.createElement("ul");
          ul.className = "participants-list";
          details.participants.forEach(email => {
            const li = document.createElement("li");
            li.textContent = email;
            ul.appendChild(li);
          });
          partSection.appendChild(ul);
        } else {
          const none = document.createElement("span");
          none.className = "no-participants";
          none.textContent = "No participants yet.";
          partSection.appendChild(none);
        }
        card.appendChild(partSection);

        activitiesList.appendChild(card);

        // Add to select
        if (activitySelect) {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          activitySelect.appendChild(option);
        }
      });
    } catch (err) {
      activitiesList.innerHTML = "<p class='error'>Failed to load activities.</p>";
      console.error("Error fetching activities:", err);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
