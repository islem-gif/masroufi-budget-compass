
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role, senderName, senderEmail } = await req.json();

    if (!email || !role || !senderName || !senderEmail) {
      throw new Error("Missing required fields");
    }

    // This is a simple mock of sending an email
    // In a real application, this would use a service like Resend, SendGrid, or Mailgun
    console.log(`Sending family invitation to ${email} with role ${role} from ${senderName} (${senderEmail})`);

    // For demonstration purposes we will not actually send an email, but log it
    const invitationResult = {
      success: true,
      message: "Invitation sent successfully",
      details: {
        to: email,
        role: role,
        from: senderEmail,
        sender: senderName,
        sent: new Date().toISOString(),
      }
    };

    return new Response(JSON.stringify(invitationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error sending family invitation:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
