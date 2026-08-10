from django.db import models

# Create your models here.
#1 status
class Status(models.Model):
    status_type = models.CharField(max_length=100, blank=False)
    status_name = models.CharField(max_length=100, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['status_type', 'status_name',],
                name='unique_status_type_name'
            )
        ]
        ordering = ['status_type', 'status_name']

    def __str__(self):
        return f"{self.status_type}: {self.status_name}"
