
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type CrimeFormData = {
  crime_type: string;
  date: string;
  location: string;
  status: string;
  case_number: string;
  description: string;
  suspect: string;
  evidence: string;
  investigating_officer: string;
  resolution: string;
};

export function AddCrimeDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<CrimeFormData>();

  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      return data || false;
    }
  });

  const onSubmit = async (data: CrimeFormData) => {
    try {
      const { error } = await supabase.from('crimes').insert([data]);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Crime record has been added successfully.",
      });
      
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding crime:', error);
      toast({
        title: "Error",
        description: "Failed to add crime record. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Crime
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Crime Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crime_type">Crime Type</Label>
              <Input
                id="crime_type"
                {...register("crime_type")}
                placeholder="e.g., Theft, Cybercrime"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="City, State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                {...register("status")}
                placeholder="e.g., Under Investigation, Solved"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="case_number">Case Number</Label>
              <Input
                id="case_number"
                {...register("case_number")}
                placeholder="e.g., CR-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investigating_officer">Investigating Officer</Label>
              <Input
                id="investigating_officer"
                {...register("investigating_officer")}
                placeholder="Officer name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detailed description of the crime"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suspect">Suspect</Label>
            <Input
              id="suspect"
              {...register("suspect")}
              placeholder="Suspect details"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence</Label>
            <Textarea
              id="evidence"
              {...register("evidence")}
              placeholder="List of evidence collected"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              {...register("resolution")}
              placeholder="Current resolution or outcome"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
