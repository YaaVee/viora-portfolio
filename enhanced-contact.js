// Enhanced Contact Features
function initEnhancedContact() {
    // 1. Live Chat Widget (Simulated)
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-button">
            <i class="fas fa-comment"></i>
        </div>
        <div class="chat-window">
            <div class="chat-header">
                <h4>Security Assistant</h4>
                <span class="chat-status">Online</span>
            </div>
            <div class="chat-messages">
                <div class="message bot">
                    Hi! How can I help with your security needs today?
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);
    
    // 2. Appointment Scheduler
    function createScheduler() {
        return `
            <div class="scheduler">
                <h3>Schedule a Security Consultation</h3>
                <form id="consultation-form">
                    <div class="form-row">
                        <input type="text" placeholder="Name" required>
                        <input type="email" placeholder="Email" required>
                    </div>
                    <div class="form-row">
                        <input type="tel" placeholder="Phone">
                        <select>
                            <option>Select Service</option>
                            <option>Cloud Security</option>
                            <option>Network Security</option>
                            <option>Compliance</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <input type="date" min="${new Date().toISOString().split('T')[0]}">
                        <input type="time">
                    </div>
                    <div class="form-row">
                        <textarea placeholder="Brief description of your needs" rows="3"></textarea>
                    </div>
                    <button type="submit">Schedule Consultation</button>
                </form>
            </div>
        `;
    }
    
    // Add scheduler to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const schedulerDiv = document.createElement('div');
        schedulerDiv.innerHTML = createScheduler();
        contactSection.appendChild(schedulerDiv);
    }
    
    // 3. Quick Response Templates
    const quickResponses = [
        "I need help with AWS security",
        "Network security assessment",
        "Compliance audit preparation",
        "Incident response retainer"
    ];
    
    const quickReplies = document.createElement('div');
    quickReplies.className = 'quick-replies';
    quickReplies.innerHTML = `
        <p>Common requests:</p>
        <div class="quick-buttons">
            ${quickResponses.map(r => `<button class="quick-btn">${r}</button>`).join('')}
        </div>
    `;
    
    document.querySelector('.chat-window .chat-messages')?.appendChild(quickReplies);
}

document.addEventListener('DOMContentLoaded', initEnhancedContact);
